import { cn } from '@/lib/utils';

type AdminStatCardProps = {
    label: string;
    value: number | string;
    hint: string;
    active?: boolean;
    onClick?: () => void;
};

export function AdminStatCard({
    label,
    value,
    hint,
    active = false,
    onClick,
}: AdminStatCardProps) {
    const className = cn(
        'rounded-2xl border bg-white p-5 text-left transition dark:bg-neutral-900',
        onClick && 'hover:-translate-y-0.5 hover:shadow-md',
        active
            ? 'border-brand-green/50 ring-2 ring-brand-green/20'
            : 'border-sidebar-border/70 dark:border-sidebar-border',
    );

    const body = (
        <>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="mt-2 font-serif text-3xl font-bold tracking-tight text-navy dark:text-foreground">
                {value}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
        </>
    );

    if (onClick) {
        return (
            <button type="button" onClick={onClick} className={className}>
                {body}
            </button>
        );
    }

    return <div className={className}>{body}</div>;
}
