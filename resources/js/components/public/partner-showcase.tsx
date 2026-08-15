import { Link } from '@inertiajs/react';
import { Handshake } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Partner = {
    id: number;
    name: string;
    logo: string | null;
    url: string | null;
};

type PartnerShowcaseProps = {
    partners: Partner[];
    settings: Record<string, string | undefined>;
};

function setting(
    settings: Record<string, string | undefined>,
    key: string,
    fallback: string,
): string {
    return settings[key] || fallback;
}

function PartnerLogo({ partner }: { partner: Partner }) {
    const tile = (
        <div className="group/logo mx-3 flex h-[88px] w-[200px] shrink-0 items-center justify-center rounded-md bg-white px-6 py-4 shadow-sm md:mx-5 md:w-[220px]">
            {partner.logo ? (
                <img
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    className="max-h-12 max-w-full object-contain opacity-70 grayscale transition duration-300 group-hover/logo:scale-105 group-hover/logo:opacity-100 group-hover/logo:grayscale-0"
                />
            ) : (
                <span className="text-center font-serif text-xs font-semibold tracking-wide text-navy/50 uppercase transition duration-300 group-hover/logo:text-navy">
                    {partner.name}
                </span>
            )}
        </div>
    );

    if (partner.url) {
        return (
            <a
                href={partner.url}
                target="_blank"
                rel="noreferrer"
                className="block shrink-0"
            >
                {tile}
            </a>
        );
    }

    return <div className="shrink-0">{tile}</div>;
}

function PartnerMarquee({ partners }: { partners: Partner[] }) {
    const sets = [0, 1] as const;

    return (
        <div className="partner-marquee group/marquee mt-12 overflow-hidden py-2">
            <div className="partner-marquee-track flex flex-nowrap items-center">
                {sets.map((setIndex) => (
                    <div
                        key={setIndex}
                        className="flex shrink-0 flex-nowrap items-center"
                        aria-hidden={setIndex === 1 ? true : undefined}
                    >
                        {partners.map((partner) => (
                            <PartnerLogo
                                key={`${setIndex}-${partner.id}`}
                                partner={partner}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export function PartnerShowcase({ partners, settings }: PartnerShowcaseProps) {
    const eyebrow = setting(settings, 'about_partners_eyebrow', 'Our Partners');
    const heading = setting(
        settings,
        'about_partners_heading',
        'Building partnerships that last',
    );
    const intro = setting(
        settings,
        'about_partners_intro',
        'HopeSpring works best alongside institutions, foundations, and mission-aligned organisations that share our commitment to empowering individuals and transforming communities.',
    );
    const emptyTitle = setting(
        settings,
        'about_partners_empty_title',
        'Partnerships in progress',
    );
    const emptyMessage = setting(
        settings,
        'about_partners_empty_message',
        'We do not have formal partner listings yet. We are building relationships with organisations that align with our work in clean water, education, healthcare, and community development.',
    );
    const ctaLabel = setting(
        settings,
        'about_partners_cta_label',
        'Explore Partnership Opportunities',
    );

    return (
        <section className="bg-navy px-4 py-16 md:px-6 md:py-24">
            <div className="mx-auto max-w-7xl">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="text-xs font-bold tracking-[0.18em] text-brand-green-light uppercase">
                        {eyebrow}
                    </p>
                    <h2 className="mt-3 font-serif text-3xl font-bold text-white md:text-4xl">
                        {heading}
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-white/75">
                        {intro}
                    </p>
                </div>

                {partners.length > 0 ? (
                    <PartnerMarquee partners={partners} />
                ) : (
                    <div className="mx-auto mt-12 max-w-2xl border border-white/15 bg-white/5 px-8 py-10 text-center">
                        <Handshake className="mx-auto size-10 text-brand-green-light" />
                        <h3 className="mt-4 font-serif text-xl font-semibold text-white">
                            {emptyTitle}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-white/70">
                            {emptyMessage}
                        </p>
                        <Button
                            asChild
                            size="lg"
                            className="mt-6 bg-brand-green font-bold hover:bg-brand-green-dark"
                        >
                            <Link href="/get-involved/partner">{ctaLabel}</Link>
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
}
