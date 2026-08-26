import { ImagePlus, Play, Trash2 } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type MediaUploadProps = {
    label?: string;
    files: File[];
    existingUrl?: string | null;
    existingIsVideo?: boolean;
    multiple?: boolean;
    onChange: (files: File[]) => void;
    error?: string;
    hint?: string;
};

function isVideoFile(file: File): boolean {
    return file.type.startsWith('video/');
}

export function MediaUpload({
    label = 'Photos and videos',
    files,
    existingUrl,
    existingIsVideo = false,
    multiple = false,
    onChange,
    error,
    hint = 'JPG, PNG, WEBP, GIF, MP4, WEBM, or MOV up to 50MB each.',
}: MediaUploadProps) {
    const inputId = useId();
    const inputRef = useRef<HTMLInputElement>(null);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const urls = files.map((file) => URL.createObjectURL(file));
        setPreviewUrls(urls);

        return () => {
            urls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [files]);

    function pickFiles(list: FileList | File[] | null) {
        if (!list) {
            return;
        }

        const next = Array.from(list).filter(
            (file) =>
                file.type.startsWith('image/') ||
                file.type.startsWith('video/'),
        );

        if (next.length === 0) {
            return;
        }

        onChange(multiple ? [...files, ...next] : next.slice(0, 1));
    }

    function clear() {
        onChange([]);

        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }

    const hasSelection = files.length > 0;
    const shownExisting = !hasSelection && existingUrl ? existingUrl : null;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">{label}</p>
                {(hasSelection || shownExisting) && (
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
                    pickFiles(e.dataTransfer.files);
                }}
                className={cn(
                    'relative flex min-h-40 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed transition',
                    isDragging
                        ? 'border-brand-green bg-brand-green/5'
                        : 'border-sidebar-border/80 bg-muted/30 hover:border-brand-green/50 hover:bg-muted/50',
                    (hasSelection || shownExisting) && 'border-solid',
                )}
            >
                {hasSelection ? (
                    <div
                        className={cn(
                            'grid w-full gap-2 p-3',
                            files.length > 1 ? 'grid-cols-2' : 'grid-cols-1',
                        )}
                    >
                        {files.map((file, index) => (
                            <div
                                key={`${file.name}-${index}`}
                                className="relative aspect-[16/10] overflow-hidden rounded-lg bg-navy-dark"
                            >
                                {isVideoFile(file) ? (
                                    <>
                                        <video
                                            src={previewUrls[index]}
                                            className="size-full object-cover"
                                            muted
                                            playsInline
                                        />
                                        <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-navy-dark/85 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                                            <Play className="size-3 fill-white" />
                                            Video
                                        </span>
                                    </>
                                ) : (
                                    <img
                                        src={previewUrls[index]}
                                        alt=""
                                        className="size-full object-cover"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                ) : shownExisting ? (
                    existingIsVideo ? (
                        <video
                            src={shownExisting}
                            className="h-full max-h-64 w-full object-cover"
                            controls
                            playsInline
                        />
                    ) : (
                        <img
                            src={shownExisting}
                            alt="Current gallery media"
                            className="h-full max-h-64 w-full object-cover"
                        />
                    )
                ) : (
                    <div className="flex flex-col items-center gap-2 px-6 py-8 text-center text-muted-foreground">
                        <div className="rounded-full bg-background p-3 shadow-sm">
                            <ImagePlus className="size-5 text-brand-green" />
                        </div>
                        <p className="text-sm font-medium text-foreground">
                            Drop files here, or click to upload
                        </p>
                        <p className="text-xs">{hint}</p>
                    </div>
                )}
            </label>

            <input
                ref={inputRef}
                id={inputId}
                type="file"
                multiple={multiple}
                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
                className="sr-only"
                onChange={(e) => {
                    pickFiles(e.target.files);
                    e.target.value = '';
                }}
            />

            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}
