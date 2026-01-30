import { supabase } from "@/lib/supabase";
import type { Document, StorageStats } from "../types";

const BUCKET_NAME = "course-materials";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

/**
 * Upload a file to Supabase Storage and save metadata to database.
 * @param file - The file to upload
 * @param userId - The user ID
 * @param onProgress - Callback for upload progress
 */
export async function uploadDocument(
  file: File,
  userId: string,
  onProgress?: (progress: number) => void,
): Promise<Document> {
  // 1. Upload file to Storage
  // Structure: {userId}/{timestamp}_{filename}
  const timestamp = new Date().getTime();
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const filePath = `${userId}/${timestamp}_${cleanFileName}`;

  // Consider XHR for progress if Supabase client doesn't support fine-grained progress easily
  // But standard supabase client allows simple upload.
  // We can't easily get progress from the standard client await call,
  // but let's assume standard upload for now to keep it clean.
  // If we need real progress, we might need a custom uploader or TUS.
  // For now, will just emit 0 and 100.

  onProgress?.(10);

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("Storage upload error:", uploadError);
    throw new Error(`Failed to upload ${file.name}`);
  }

  onProgress?.(50);

  // 2. Save metadata to Database
  const { data: document, error: dbError } = await supabase
    .from("documents")
    .insert({
      user_id: userId,
      title: file.name,
      file_path: filePath,
      file_type: file.type,
      file_size: file.size,
      status: "pending",
    })
    .select()
    .single();

  if (dbError || !document) {
    console.error("Database insert error:", dbError);
    // Cleanup storage if DB fails? ideally yes, but keeping it simple for now.
    throw new Error(`Failed to save metadata for ${file.name}`);
  }

  onProgress?.(80);

  // 3. Trigger Backend Processing
  try {
    const response = await fetch(
      `${API_URL}/documents/process/${document.id}`,
      {
        method: "POST",
      },
    );

    if (!response.ok) {
      console.warn("Failed to trigger background processing");
      // We don't throw here because the file IS uploaded, just not processed yet.
      // The user can see it's "pending" in the UI ideally.
    }
  } catch (err) {
    console.warn("API unavailable for processing", err);
  }

  onProgress?.(100);

  return {
    id: document.id,
    userId: document.user_id,
    title: document.title,
    filePath: document.file_path,
    fileType: document.file_type,
    fileSize: document.file_size,
    status: document.status as any,
    createdAt: document.created_at,
    updatedAt: document.updated_at,
  };
}

/**
 * Fetch all documents for a user.
 */
export async function fetchUserDocuments(userId: string): Promise<Document[]> {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Failed to fetch documents");
  }

  return data.map((doc) => ({
    id: doc.id,
    userId: doc.user_id,
    title: doc.title,
    filePath: doc.file_path,
    fileType: doc.file_type,
    fileSize: doc.file_size,
    status: doc.status as any,
    createdAt: doc.created_at,
    updatedAt: doc.updated_at,
  }));
}

/**
 * Get user storage stats.
 */
export async function getUserStorageStats(
  userId: string,
): Promise<StorageStats> {
  // Using a sum query
  const { data, error } = await supabase
    .from("documents") // This will be filtered by RLS automatically?
    // Wait, RLS filters rows. Aggregate functions usually work on visible rows.
    .select("file_size", { count: "exact" })
    .eq("user_id", userId);

  if (error) {
    console.error("Stats error", error);
    return { usedSpace: 0, fileCount: 0 };
  }

  const totalSize = data?.reduce((sum, doc) => sum + doc.file_size, 0) || 0;
  const count = data?.length || 0;

  return {
    usedSpace: totalSize,
    fileCount: count,
  };
}

/**
 * Delete a document.
 */
export async function deleteDocument(
  documentId: string,
  filePath: string,
): Promise<void> {
  // 1. Delete from storage
  const { error: storageError } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (storageError) {
    console.warn("Failed to delete file from storage", storageError);
    // Continue to delete DB record anyway?
    // If storage delete fails, we might end up with orphan files.
    // But usually prompt deletion from DB is more important for user view.
  }

  // 2. Delete from DB
  const { error: dbError } = await supabase
    .from("documents")
    .delete()
    .eq("id", documentId);

  if (dbError) {
    throw new Error("Failed to delete document record");
  }
}
