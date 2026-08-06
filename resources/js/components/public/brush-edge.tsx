import { cn } from '@/lib/utils';

type BrushEdgeProps = {
    className?: string;
    fill?: string;
    flip?: boolean;
};

export function BrushEdge({ className, fill = 'currentColor', flip = false }: BrushEdgeProps) {
    return (
        <svg
            viewBox="0 0 1440 60"
            preserveAspectRatio="none"
            className={cn('block w-full', flip && 'rotate-180', className)}
            aria-hidden="true"
        >
            <path
                d="M0,30 C60,45 120,10 180,25 C240,40 300,8 360,20 C420,32 480,12 540,28 C600,44 660,6 720,22 C780,38 840,10 900,26 C960,42 1020,8 1080,24 C1140,40 1200,12 1260,28 C1320,44 1380,15 1440,30 L1440,60 L0,60 Z"
                fill={fill}
            />
        </svg>
    );
}
