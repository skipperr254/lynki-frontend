import { useRef } from "react";
import { Upload, X, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useFileUpload } from "../hooks/useFileUpload";

interface FileUploaderProps {
  userId: string;
  onUploadComplete?: () => void;
}

export function FileUploader({ userId, onUploadComplete }: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploading, uploads, error, handleFilesSelected, resetUploads } =
    useFileUpload(onUploadComplete);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilesSelected(e.target.files, userId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!uploading) {
      handleFilesSelected(e.dataTransfer.files, userId);
    }
  };

  const hasUploads = uploads.length > 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Materials</CardTitle>
        <CardDescription>
          Drag and drop files here or click to select. Max 10MB per file.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasUploads && (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              uploading
                ? "border-muted bg-muted/50"
                : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50 cursor-pointer"
            }`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => !uploading && fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-primary/10 rounded-full">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div className="text-sm font-medium">
                Click to upload or drag and drop
              </div>
              <div className="text-xs text-muted-foreground">
                PDF, DOCX, PPTX, Images (Max 5 files)
              </div>
            </div>
            <Input
              ref={fileInputRef}
              type="file"
              className="hidden"
              multiple
              onChange={onFileChange}
              disabled={uploading}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
            />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {hasUploads && (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm font-medium">
              <span>
                {uploading
                  ? `Uploading ${uploads.length} files...`
                  : "Upload complete"}
              </span>
              {!uploading && (
                <Button variant="ghost" size="sm" onClick={resetUploads}>
                  Upload More
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {uploads.map((upload, index) => (
                <div
                  key={`${upload.fileName}-${index}`}
                  className="bg-muted/30 rounded-lg p-3 border"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2 truncate max-w-[80%]">
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span
                        className="text-sm truncate"
                        title={upload.fileName}
                      >
                        {upload.fileName}
                      </span>
                    </div>
                    {upload.error ? (
                      <X className="h-4 w-4 text-destructive" />
                    ) : upload.complete ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {upload.progress}%
                      </span>
                    )}
                  </div>

                  {upload.error ? (
                    <p className="text-xs text-destructive">{upload.error}</p>
                  ) : (
                    <Progress value={upload.progress} className="h-1.5" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
