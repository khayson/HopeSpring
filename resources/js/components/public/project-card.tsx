import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { MapPin } from 'lucide-react';

type ProjectCardProps = {
    title: string;
    description: string;
    location: string;
    image?: string;
    href?: string;
    className?: string;
};

export function ProjectCard({ title, description, location, image, href, className }: ProjectCardProps) {
    const card = (
        <div className={cn('group overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-xl', className)}>
            {image && (
                <div className="overflow-hidden">
                    <img
                        src={image}
                        alt={title}
                        className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        width={400}
                        height={192}
                        loading="lazy"
                    />
                </div>
            )}
            <div className="p-5">
                <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-brand-green">
                    <MapPin className="size-3.5" />
                    {location}
                </div>
                <h3 className="font-serif text-base font-semibold text-navy">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>
        </div>
    );

    if (href) {
        return <Link href={href}>{card}</Link>;
    }

    return card;
}
