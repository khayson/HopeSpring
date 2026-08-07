import { Link, usePage } from '@inertiajs/react';
import { CircleDollarSign, Handshake, LayoutGrid, Mail, Newspaper, Settings, Sparkles, Users } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage().props;
    const role = auth.user?.role;

    const mainNavItems: NavItem[] = [
        { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
    ];

    if (role === 'admin' || role === 'editor') {
        mainNavItems.push(
            { title: 'Events', href: '/admin/events', icon: Sparkles },
            { title: 'Blog Posts', href: '/admin/posts', icon: Newspaper },
        );
    }

    if (role === 'admin' || role === 'finance') {
        mainNavItems.push({ title: 'Donations', href: '/admin/donations', icon: CircleDollarSign });
    }

    if (role === 'admin') {
        mainNavItems.push(
            { title: 'Inquiries', href: '/admin/inquiries', icon: Handshake },
            { title: 'Messages', href: '/admin/messages', icon: Mail },
            { title: 'Newsletter', href: '/admin/newsletter', icon: Users },
            { title: 'Users', href: '/admin/users', icon: Users },
            { title: 'Settings', href: '/admin/settings', icon: Settings },
        );
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
