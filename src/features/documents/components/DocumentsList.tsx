import {
  FileIcon,
  Trash2,
  Calendar,
  HardDrive,
  Loader2,
  CheckCircle,
  XCircle,
  RefreshCw,
  BookOpen,
  Play,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Document } from "../types";
import {
  fetchDocumentQuiz,
  subscribeToQuizUpdates,
} from "@/features/quiz/services/quizService";
import type { QuizListItem } from "@/types/quiz";

interface DocumentsListProps {
  documents: Document[];
  onDelete: (id: string, filePath: string) => void;
  onRetry?: (doc: Document) => void;
  loading: boolean;
}

export function DocumentsList({
  documents,
  onDelete,
  onRetry,
  loading,
}: DocumentsListProps) {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Map<string, QuizListItem>>(new Map());

  // Memoize document IDs to prevent unnecessary re-fetches
  const documentIds = useMemo(
    () => documents.map((doc) => doc.id).join(","),
    [documents],
  );

  useEffect(() => {
    // Load quiz status for each document
    async function loadQuizStatuses() {
      if (documents.length === 0) return;

      const quizMap = new Map<string, QuizListItem>();

      await Promise.all(
        documents.map(async (doc) => {
          try {
            const quiz = await fetchDocumentQuiz(doc.id);
            if (quiz) {
              quizMap.set(doc.id, quiz);
            }
          } catch (err) {
            console.error(`Failed to load quiz for document ${doc.id}:`, err);
          }
        }),
      );

      setQuizzes(quizMap);
    }

    loadQuizStatuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentIds]); // Use memoized IDs instead of documents array

  useEffect(() => {
    // Subscribe to quiz updates for each document
    if (documents.length === 0) return;

    const unsubscribeFunctions = documents.map((doc) =>
      subscribeToQuizUpdates(doc.id, (quiz) => {
        setQuizzes((prev) => new Map(prev).set(doc.id, quiz));
      }),
    );

    return () => {
      unsubscribeFunctions.forEach((unsub) => unsub());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentIds]); // Use memoized IDs to prevent subscription churn

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleRetry = (doc: Document) => {
    if (onRetry) {
      onRetry(doc);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <Card className="text-center p-8 bg-muted/20 border-dashed">
        <CardContent className="space-y-4 pt-6">
          <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
            <HardDrive className="text-muted-foreground w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-medium">No documents yet</h3>
            <p className="text-sm text-muted-foreground">
              Upload your course materials to get started.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Documents</CardTitle>
        <CardDescription>Manage your uploaded course materials</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Quiz</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <FileIcon className="w-4 h-4 text-primary" />
                    <span className="truncate max-w-50" title={doc.title}>
                      {doc.title}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{formatFileSize(doc.fileSize)}</TableCell>
                <TableCell>
                  {doc.status === "processing" || doc.status === "pending" ? (
                    <div className="flex items-center text-blue-500 text-xs">
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      Processing
                    </div>
                  ) : doc.status === "completed" ? (
                    <div className="flex items-center text-green-600 text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Ready
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-red-500 text-xs">
                        <XCircle className="w-3 h-3 mr-1" />
                        Failed
                      </div>
                      {onRetry && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => handleRetry(doc)}
                        >
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Retry
                        </Button>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {(() => {
                    const quiz = quizzes.get(doc.id);
                    if (!quiz) {
                      return (
                        <div className="flex items-center text-muted-foreground text-xs">
                          <BookOpen className="w-3 h-3 mr-1" />
                          No quiz
                        </div>
                      );
                    }
                    if (quiz.generationStatus === "generating") {
                      return (
                        <Badge variant="secondary" className="text-xs">
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          Generating
                        </Badge>
                      );
                    }
                    if (quiz.generationStatus === "completed") {
                      return (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs gap-1"
                          onClick={() => navigate(`/quiz/${quiz.id}`)}
                        >
                          <Play className="w-3 h-3" />
                          Take Quiz
                        </Button>
                      );
                    }
                    return (
                      <Badge variant="destructive" className="text-xs">
                        Failed
                      </Badge>
                    );
                  })()}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDistanceToNow(new Date(doc.createdAt), {
                      addSuffix: true,
                    })}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(doc.id, doc.filePath)}
                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
