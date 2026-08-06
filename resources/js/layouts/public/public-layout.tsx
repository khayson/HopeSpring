import { Footer } from '@/components/public/footer';
import { Navbar } from '@/components/public/navbar';

type PublicLayoutProps = {
    currentPath?: string;
    children: React.ReactNode;
};

export default function PublicLayout({ currentPath, children }: PublicLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Navbar currentPath={currentPath} />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
