import { Link } from '@inertiajs/react';
import { Heart } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { logout } from '@/routes';

export default function PortalLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <header className="border-b border-border bg-navy-dark">
                <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-full bg-brand-green">
                            <Heart className="size-4 text-white" fill="white" />
                        </div>
                        <span className="font-serif text-lg font-bold text-white">HopeSpring</span>
                    </Link>
                    <Button asChild variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                        <Link href={logout()} method="post" as="button">
                            Log out
                        </Link>
                    </Button>
                </div>
            </header>
            <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16">{children}</main>
        </div>
    );
}
