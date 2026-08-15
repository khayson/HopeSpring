import { Link, usePage } from '@inertiajs/react';
import {
    Facebook,
    Heart,
    Instagram,
    Mail,
    MapPin,
    Phone,
    Twitter,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { NewsletterForm } from './newsletter-form';

const quickLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Our Programmes', href: '/programmes' },
    { label: 'Projects', href: '/projects' },
    { label: 'Get Involved', href: '/get-involved' },
    { label: 'News & Stories', href: '/news' },
    { label: 'Contact', href: '/contact' },
];

const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
];

type FooterProps = {
    className?: string;
};

export function Footer({ className }: FooterProps) {
    const { contact } = usePage().props;
    const email = contact.email?.trim() || 'info@hopespringfoundation.org';
    const phone = contact.phone?.trim() || '+233 24 123 4567';
    const address =
        contact.address?.trim() ||
        '14 Maseru Road, East Legon, Accra, Ghana';
    const telHref = `tel:${phone.replace(/[^\d+]/g, '')}`;

    return (
        <footer
            aria-label="Site footer"
            className={cn('bg-navy-dark text-white', className)}
        >
            <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex size-8 items-center justify-center rounded-full bg-brand-green">
                                <Heart
                                    className="size-4 text-white"
                                    fill="white"
                                />
                            </div>
                            <span className="font-serif text-lg font-bold">
                                HopeSpring
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed text-white/60">
                            A purpose-driven organization committed to empowering
                            individuals and transforming communities through
                            sustainable, people-centered solutions.
                        </p>
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-brand-green hover:text-white"
                                >
                                    <social.icon className="size-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-4 font-serif text-base font-semibold">
                            Quick Links
                        </h3>
                        <ul className="space-y-2.5">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-white/60 transition-colors hover:text-brand-green-light"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="mb-4 font-serif text-base font-semibold">
                            Contact Us
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2.5 text-sm text-white/60">
                                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-green-light" />
                                {address}
                            </li>
                            <li>
                                <a
                                    href={`mailto:${email}`}
                                    className="flex items-center gap-2.5 text-sm text-white/60 transition-colors hover:text-brand-green-light"
                                >
                                    <Mail className="size-4 shrink-0 text-brand-green-light" />
                                    {email}
                                </a>
                            </li>
                            <li>
                                <a
                                    href={telHref}
                                    className="flex items-center gap-2.5 text-sm text-white/60 transition-colors hover:text-brand-green-light"
                                >
                                    <Phone className="size-4 shrink-0 text-brand-green-light" />
                                    {phone}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="mb-4 font-serif text-base font-semibold">
                            Newsletter
                        </h3>
                        <p className="mb-4 text-sm text-white/60">
                            Stay updated on our impact and upcoming events.
                        </p>
                        <NewsletterForm />
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/10">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-white/40 md:flex-row md:px-6">
                    <p>
                        &copy; {new Date().getFullYear()} HopeSpring Foundation.
                        All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <Link
                            href="/privacy"
                            className="transition-colors hover:text-white/60"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms"
                            className="transition-colors hover:text-white/60"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            href="/login"
                            className="transition-colors hover:text-white/60"
                        >
                            Staff Login
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
