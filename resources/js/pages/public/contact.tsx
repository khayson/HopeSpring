import { Head } from '@inertiajs/react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { ContactForm } from '@/components/public/contact-form';
import { PageHero } from '@/components/public/page-hero';
import PublicLayout from '@/layouts/public/public-layout';
import { pageHeroes } from '@/lib/page-heroes';

type Props = {
    settings: Record<string, string>;
};

export default function Contact({ settings }: Props) {
    return (
        <PublicLayout currentPath="/contact">
            <Head title="Contact Us — HopeSpring Foundation" />

            <PageHero
                title="Contact Us"
                subtitle="We'd love to hear from you. Reach out with questions, partnership ideas, or just to say hello."
                image={pageHeroes.contact}
            />

            <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
                <div className="grid gap-12 lg:grid-cols-5">
                    {/* Contact Info */}
                    <div className="lg:col-span-2">
                        <h2 className="font-serif text-2xl font-bold text-navy dark:text-foreground">
                            Get In Touch
                        </h2>
                        <p className="mt-3 text-muted-foreground">
                            Have a question, want to volunteer, or interested in
                            partnering with us? We&apos;d love to hear from you.
                        </p>

                        <div className="mt-8 space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-green/10">
                                    <MapPin className="size-5 text-brand-green" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-navy dark:text-foreground">
                                        Address
                                    </h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {settings.contact_address ||
                                            'Tema Golf City, Samuel Narh Street'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-green/10">
                                    <Mail className="size-5 text-brand-green" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-navy dark:text-foreground">
                                        Email
                                    </h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {settings.contact_email ||
                                            'info@hopespringfoundation.org'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-green/10">
                                    <Phone className="size-5 text-brand-green" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-navy dark:text-foreground">
                                        Phone
                                    </h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {(
                                            settings.contact_phone ||
                                            '0501265688 / 0208664519'
                                        )
                                            .split('/')
                                            .map((value) => value.trim())
                                            .filter(Boolean)
                                            .map((number, index) => (
                                                <span key={number}>
                                                    {index > 0 && ' / '}
                                                    <a
                                                        href={`tel:${number.replace(/[^\d+]/g, '')}`}
                                                        className="hover:text-brand-green"
                                                    >
                                                        {number}
                                                    </a>
                                                </span>
                                            ))}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-3">
                        <ContactForm />
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
