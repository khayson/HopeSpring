import { Link } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { BrandLogo } from '@/components/brand-logo';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

type NavLink = {
    label: string;
    href: string;
};

const navLinks: NavLink[] = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Our Programs', href: '/programmes' },
    { label: 'Projects', href: '/projects' },
    { label: 'Get Involved', href: '/get-involved' },
    { label: 'News & Stories', href: '/news' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Contact', href: '/contact' },
];

type NavbarProps = {
    currentPath?: string;
};

export function Navbar({ currentPath = '/' }: NavbarProps) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-dark/95 backdrop-blur-sm">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center"
                    aria-label="HopeSpring Foundation home"
                >
                    <BrandLogo
                        variant="mono"
                        className="h-10 w-auto max-w-[220px] sm:h-11 sm:max-w-[260px]"
                    />
                </Link>

                {/* Desktop Nav */}
                <nav
                    aria-label="Main navigation"
                    className="hidden items-center gap-1 lg:flex"
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                'rounded-md px-3 py-2 text-sm font-semibold transition-colors',
                                currentPath === link.href
                                    ? 'text-brand-green-light'
                                    : 'text-white/80 hover:text-white',
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Donate CTA */}
                <div className="hidden lg:block">
                    <Button
                        asChild
                        className="bg-brand-green font-bold hover:bg-brand-green-dark"
                    >
                        <Link href="/donate">Donate Now</Link>
                    </Button>
                </div>

                {/* Mobile toggle */}
                <button
                    type="button"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="rounded-md p-2 text-white lg:hidden"
                    aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={mobileOpen}
                    aria-controls="mobile-nav"
                >
                    {mobileOpen ? (
                        <X className="size-6" />
                    ) : (
                        <Menu className="size-6" />
                    )}
                </button>
            </div>

            {/* Mobile menu — overlay, never pushes content */}
            {mobileOpen && (
                <nav
                    id="mobile-nav"
                    aria-label="Mobile navigation"
                    className="absolute top-full right-0 left-0 z-40 border-t border-white/10 bg-navy-dark shadow-xl lg:hidden"
                >
                    <div className="px-4 pb-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                    'block rounded-md px-3 py-3 text-sm font-semibold transition-colors',
                                    currentPath === link.href
                                        ? 'text-brand-green-light'
                                        : 'text-white/80 hover:text-white',
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="mt-3 px-3">
                            <Button
                                asChild
                                className="w-full bg-brand-green font-bold hover:bg-brand-green-dark"
                            >
                                <Link href="/donate">Donate Now</Link>
                            </Button>
                        </div>
                    </div>
                </nav>
            )}
        </header>
    );
}
