import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { BrandLogo } from '@/components/brand-logo';
import { Button } from '@/components/ui/button';
import { logout } from '@/routes';

export default function PortalLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <header className="border-b border-border bg-navy-dark">
                <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
                    <Link
                        href="/"
                        className="inline-flex"
                        aria-label="HopeSpring Foundation home"
                    >
                        <BrandLogo
                            variant="mono"
                            className="h-10 w-auto max-w-[220px]"
                        />
                    </Link>
                    <Button
                        asChild
                        variant="ghost"
                        className="text-white hover:bg-white/10 hover:text-white"
                    >
                        <Link href={logout()} method="post" as="button">
                            Log out
                        </Link>
                    </Button>
                </div>
            </header>
            <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16">
                {children}
            </main>
        </div>
    );
}
