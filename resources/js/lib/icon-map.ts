import {
    Award,
    Baby,
    Droplets,
    GraduationCap,
    Handshake,
    Heart,
    HeartPulse,
    Leaf,
    Package,
    Shield,
    Sparkles,
    Star,
    Users,
    Venus,
    Wrench,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const icons: Record<string, LucideIcon> = {
    Award,
    Baby,
    Droplets,
    GraduationCap,
    Handshake,
    Heart,
    HeartPulse,
    Leaf,
    Package,
    Shield,
    Sparkles,
    Star,
    Users,
    Venus,
    Wrench,
};

export function getIcon(name: string | null | undefined): LucideIcon {
    return icons[name ?? ''] ?? HeartPulse;
}
