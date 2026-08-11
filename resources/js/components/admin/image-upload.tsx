import { CalendarDays, ImagePlus, Trash2 } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ImageUploadProps = {
    label?: string;
    value: File | null;
    existingUrl?: string | null;
    onChange: (file: File | null) => void;
    onRemoveExisting?: () => void;
    removeExisting?: boolean;
    error?: string;
    hint?: string;
};

export function ImageUpload({
    label = 'Cover photo',
    value,
    existingUrl,
    onChange,
    onRemoveExisting,
    removeExisting = false,
    error,
    hint = 'JPG, PNG, WEBP, or GIF up to 5MB.',
}: ImageUploadProps) {
    const inputId = useId();
    const inputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (!value) {
            setPreviewUrl(null);

            return;
        }

        const objectUrl = URL.createObjectURL(value);
        setPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [value]);

    const shownUrl =
        previewUrl ?? (!removeExisting && existingUrl ? existingUrl : null);

    function pickFile(file: File | null) {
        if (!file) {
            return;
        }

        if (!file.type.startsWith('image/')) {
            return;
        }

        onChange(file);
    }

    function clear() {
        onChange(null);

        if (inputRef.current) {
            inputRef.current.value = '';
        }

        if (existingUrl && !removeExisting) {
            onRemoveExisting?.();
        }
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">{label}</p>
                {shownUrl && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                        onClick={clear}
                    >
                        <Trash2 className="size-3.5" />
                        Remove
                    </Button>
                )}
            </div>

            <label
                htmlFor={inputId}
                onDragEnter={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                }}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    pickFile(e.dataTransfer.files?.[0] ?? null);
                }}
                className={cn(
                    'relative flex aspect-[16/10] cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed transition',
                    isDragging
                        ? 'border-brand-green bg-brand-green/5'
                        : 'border-sidebar-border/80 bg-muted/30 hover:border-brand-green/50 hover:bg-muted/50',
                    shownUrl && 'border-solid',
                )}
            >
                {shownUrl ? (
                    <img
                        src={shownUrl}
                        alt="Selected cover preview"
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center gap-2 px-6 text-center text-muted-foreground">
                        <div className="rounded-full bg-background p-3 shadow-sm">
                            <ImagePlus className="size-5 text-brand-green" />
                        </div>
                        <p className="text-sm font-medium text-foreground">
                            Drop an image here, or click to upload
                        </p>
                        <p className="text-xs">{hint}</p>
                    </div>
                )}

                {shownUrl && (
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-gradient-to-t from-black/55 to-transparent p-3 pt-10">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-navy">
                            <CalendarDays className="size-3.5" />
                            Change photo
                        </span>
                    </div>
                )}
            </label>

            <input
                ref={inputRef}
                id={inputId}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
            />

            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}
