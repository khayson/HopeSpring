import { Droplets, GraduationCap, HeartPulse, Sparkles, Users, Wrench } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const icons: Record<string, LucideIcon> = {
    Droplets,
    GraduationCap,
    HeartPulse,
    Users,
    Sparkles,
    Wrench,
};

export function getIcon(name: string | null | undefined): LucideIcon {
    return icons[name ?? ''] ?? HeartPulse;
}
