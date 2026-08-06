import { cn } from '@/lib/utils';

type TeamCardProps = {
    name: string;
    role: string;
    image?: string;
    className?: string;
};

export function TeamCard({ name, role, image, className }: TeamCardProps) {
    return (
        <div className={cn('group text-center', className)}>
            <div className="mx-auto mb-4 size-32 overflow-hidden rounded-full bg-secondary md:size-40">
                {image ? (
                    <img
                        src={image}
                        alt={name}
                        className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
                        width={160}
                        height={160}
                        loading="lazy"
                    />
                ) : (
                    <div className="flex size-full items-center justify-center bg-navy/10 font-serif text-3xl font-bold text-navy/40">
                        {name.charAt(0)}
                    </div>
                )}
            </div>
            <h3 className="font-serif text-base font-semibold text-navy">{name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{role}</p>
        </div>
    );
}
