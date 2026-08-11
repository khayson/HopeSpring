import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Facebook, Heart, Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react';
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
    return (
        <footer aria-label="Site footer" className={cn('bg-navy-dark text-white', className)}>
            <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex size-8 items-center justify-center rounded-full bg-brand-green">
                                <Heart className="size-4 text-white" fill="white" />
                            </div>
                            <span className="font-serif text-lg font-bold">HopeSpring</span>
                        </Link>
                        <p className="text-sm leading-relaxed text-white/60">
                            Transforming lives through sustainable solutions in education, health, and
                            clean water across Ghana.
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
                        <h3 className="mb-4 font-serif text-base font-semibold">Quick Links</h3>
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
                        <h3 className="mb-4 font-serif text-base font-semibold">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2.5 text-sm text-white/60">
                                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-green-light" />
                                East Legon, Accra, Ghana
                            </li>
                            <li>
                                <a
                                    href="mailto:info@hopespringfoundation.org"
                                    className="flex items-center gap-2.5 text-sm text-white/60 transition-colors hover:text-brand-green-light"
                                >
                                    <Mail className="size-4 shrink-0 text-brand-green-light" />
                                    info@hopespringfoundation.org
                                </a>
                            </li>
                            <li>
                                <a
                                    href="tel:+233241234567"
                                    className="flex items-center gap-2.5 text-sm text-white/60 transition-colors hover:text-brand-green-light"
                                >
                                    <Phone className="size-4 shrink-0 text-brand-green-light" />
                                    +233 24 123 4567
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="mb-4 font-serif text-base font-semibold">Newsletter</h3>
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
                    <p>&copy; {new Date().getFullYear()} HopeSpring Foundation. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link href="/privacy" className="transition-colors hover:text-white/60">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="transition-colors hover:text-white/60">
                            Terms of Service
                        </Link>
                        <Link href="/login" className="transition-colors hover:text-white/60">
                            Staff Login
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
