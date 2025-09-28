import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, File, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  accept?: string;
  maxSize?: number;
  onFileUpload: (file: File | null) => void;
  helperText?: string;
  className?: string;
}

export function FileUpload({
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB default
  onFileUpload,
  helperText,
  className
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setError('');

    if (!selectedFile) {
      setFile(null);
      onFileUpload(null);
      return;
    }

    if (selectedFile.size > maxSize) {
      setError(`הקובץ גדול מדי. גודל מקסימלי: ${Math.round(maxSize / (1024 * 1024))}MB`);
      return;
    }

    setFile(selectedFile);
    onFileUpload(selectedFile);
  };

  const handleRemove = () => {
    setFile(null);
    setError('');
    onFileUpload(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {!file ? (
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          className="w-full h-20 border-dashed font-assistant"
        >
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-6 h-6" />
            <span>העלה קובץ</span>
          </div>
        </Button>
      ) : (
        <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
          <File className="w-4 h-4" />
          <span className="flex-1 font-assistant text-sm">{file.name}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
      
      {helperText && (
        <p className="text-xs text-muted-foreground font-assistant">
          {helperText}
        </p>
      )}
      
      {error && (
        <p className="text-xs text-red-600 font-assistant">
          {error}
        </p>
      )}
    </div>
  );
}