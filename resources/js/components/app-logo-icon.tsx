import { BrandLogo } from '@/components/brand-logo';
import { cn } from '@/lib/utils';

export default function AppLogoIcon({
    className,
    ...props
}: {
    className?: string;
}) {
    return (
        <BrandLogo
            variant="mark"
            className={cn('size-8', className)}
            {...props}
        />
    );
}
