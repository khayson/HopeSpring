export default function Heading({
    title,
    description,
    variant = 'default',
}: {
    title: string;
    description?: string;
    variant?: 'default' | 'small';
}) {
    return (
        <header className={variant === 'small' ? '' : 'mb-8 space-y-0.5'}>
            <h2
                className={
                    variant === 'small'
                        ? 'mb-0.5 text-base font-medium text-navy dark:text-foreground'
                        : 'text-xl font-semibold tracking-tight text-navy dark:text-foreground'
                }
            >
                {title}
            </h2>
            {description && (
                <p className="text-sm text-navy/75 dark:text-muted-foreground">
                    {description}
                </p>
            )}
        </header>
    );
}
