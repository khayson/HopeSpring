import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { cn } from '@/lib/utils';

type ScrollRevealProps = {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    as?: 'div' | 'section';
};

export function ScrollReveal({
    children,
    className,
    delay = 0,
    as: Tag = 'div',
}: ScrollRevealProps) {
    const { ref, isVisible } = useScrollReveal();

    return (
        <Tag
            ref={ref}
            className={cn(
                'transition-[opacity,transform] duration-500 ease-out',
                isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-3 opacity-0',
                className,
            )}
            style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
        >
            {children}
        </Tag>
    );
}
