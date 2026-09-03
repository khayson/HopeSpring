import { usePage } from '@inertiajs/react';

import { BrandLogo } from '@/components/brand-logo';

export default function AppLogo() {
    const { name } = usePage().props;

    return (
        <>
            <BrandLogo variant="mark" className="size-8 shrink-0" />
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {name}
                </span>
            </div>
        </>
    );
}
