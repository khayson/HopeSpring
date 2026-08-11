import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginationProps = {
    links: PaginationLink[];
};

export function Pagination({ links }: PaginationProps) {
    if (links.length <= 3) {
        return null;
    }

    return (
        <nav className="flex flex-wrap items-center gap-1 px-5 py-4">
            {links.map((link, i) => (
                <Link
                    key={i}
                    href={link.url ?? '#'}
                    preserveScroll
                    className={cn(
                        'rounded-md px-3 py-1.5 text-sm',
                        link.active
                            ? 'bg-brand-green font-semibold text-white'
                            : link.url
                              ? 'text-muted-foreground hover:bg-secondary'
                              : 'pointer-events-none text-muted-foreground/40',
                    )}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </nav>
    );
}
