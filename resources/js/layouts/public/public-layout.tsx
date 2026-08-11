import { Footer } from '@/components/public/footer';
import { Navbar } from '@/components/public/navbar';

type PublicLayoutProps = {
    currentPath?: string;
    children: React.ReactNode;
};

export default function PublicLayout({
    currentPath,
    children,
}: PublicLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-brand-green focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white focus:shadow-lg"
            >
                Skip to main content
            </a>
            <Navbar currentPath={currentPath} />
            <main id="main-content" className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}
