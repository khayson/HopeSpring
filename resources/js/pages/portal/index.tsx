import { Head } from '@inertiajs/react';
import { Heart } from 'lucide-react';

type Props = {
    name: string;
    roleLabel: string;
};

export default function PortalIndex({ name, roleLabel }: Props) {
    return (
        <>
            <Head title="Your HopeSpring Portal" />

            <div className="text-center">
                <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-brand-green/10">
                    <Heart className="size-8 text-brand-green" />
                </div>
                <h1 className="font-serif text-3xl font-bold text-navy">
                    Welcome, {name}
                </h1>
                <p className="mt-4 text-muted-foreground">
                    Thanks for stepping up as a {roleLabel.toLowerCase()} with
                    HopeSpring Foundation. Our team has your details and will be
                    in touch soon with next steps.
                </p>
            </div>
        </>
    );
}
