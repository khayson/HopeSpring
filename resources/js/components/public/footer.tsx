import { Link, usePage } from '@inertiajs/react';
import {
    Clock,
    Facebook,
    Instagram,
    Linkedin,
    Mail,
    MapPin,
    Phone,
    Twitter,
    Youtube,
} from 'lucide-react';
import { BrandLogo } from '@/components/brand-logo';
import { cn } from '@/lib/utils';
import { NewsletterForm } from './newsletter-form';

const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Our Programs', href: '/programmes' },
    { label: 'Projects', href: '/projects' },
    { label: 'Get Involved', href: '/get-involved' },
    { label: 'News & Stories', href: '/news' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Contact', href: '/contact' },
];

const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' },
];

type FooterProps = {
    className?: string;
};

export function Footer({ className }: FooterProps) {
    const { contact } = usePage().props;
    const email = contact.email?.trim() || 'info@hopespringfoundation.org';
    const phone = contact.phone?.trim() || '0501265688 / 0208664519';
    const address =
        contact.address?.trim() || 'Tema Golf City, Samuel Narh Street';
    const phones = phone
        .split('/')
        .map((value) => value.trim())
        .filter(Boolean);

    return (
        <footer
            aria-label="Site footer"
            className={cn('bg-navy-dark text-white', className)}
        >
            <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
                    <div className="space-y-4">
                        <Link
                            href="/"
                            className="inline-flex"
                            aria-label="HopeSpring Foundation home"
                        >
                            <BrandLogo
                                variant="mono"
                                className="h-12 w-auto max-w-[240px]"
                            />
                        </Link>
                        <p className="text-sm leading-relaxed text-white/60">
                            We are committed to transforming lives and building
                            better communities through compassion, partnership
                            and sustainable solutions.
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

                    <div>
                        <h3 className="mb-4 font-serif text-base font-semibold">
                            Get In Touch
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
                            <li className="flex items-start gap-2.5 text-sm text-white/60">
                                <Phone className="mt-0.5 size-4 shrink-0 text-brand-green-light" />
                                <span className="flex flex-wrap items-center gap-x-1">
                                    {phones.map((number, index) => (
                                        <span
                                            key={number}
                                            className="inline-flex items-center gap-x-1"
                                        >
                                            {index > 0 && <span>/</span>}
                                            <a
                                                href={`tel:${number.replace(/[^\d+]/g, '')}`}
                                                className="transition-colors hover:text-brand-green-light"
                                            >
                                                {number}
                                            </a>
                                        </span>
                                    ))}
                                </span>
                            </li>
                            <li className="flex items-start gap-2.5 text-sm text-white/60">
                                <Clock className="mt-0.5 size-4 shrink-0 text-brand-green-light" />
                                Mon - Fri: 8:00 AM - 5:00 PM
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 font-serif text-base font-semibold">
                            Newsletter
                        </h3>
                        <p className="mb-4 text-sm text-white/60">
                            Subscribe to our newsletter to get the latest
                            updates and inspiring stories.
                        </p>
                        <NewsletterForm />
                        <p className="mt-4 font-serif text-sm text-brand-gold-light italic">
                            Thank you for being part of the change!
                        </p>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/10">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-white/40 md:flex-row md:px-6">
                    <p>
                        &copy; {new Date().getFullYear()} HopeSpring Foundation.
                        All Right Reserved.
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
                            Terms of Use
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
