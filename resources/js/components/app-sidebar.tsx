import { Link, usePage } from '@inertiajs/react';
import {
    Building2,
    CalendarDays,
    CircleDollarSign,
    Handshake,
    LayoutGrid,
    Mail,
    Megaphone,
    Newspaper,
    Settings,
    Users,
} from 'lucide-react';
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
import { index as donationsIndex } from '@/routes/admin/donations';
import { index as eventsIndex } from '@/routes/admin/events';
import { index as inquiriesIndex } from '@/routes/admin/inquiries';
import { index as messagesIndex } from '@/routes/admin/messages';
import { index as newsletterIndex } from '@/routes/admin/newsletter';
import { index as partnersIndex } from '@/routes/admin/partners';
import { index as postsIndex } from '@/routes/admin/posts';
import { edit as settingsEdit } from '@/routes/admin/settings';
import { index as usersIndex } from '@/routes/admin/users';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage().props;
    const role = auth.user?.role;

    const mainNavItems: NavItem[] = [
        { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
    ];

    if (role === 'admin' || role === 'editor') {
        mainNavItems.push(
            { title: 'Events', href: eventsIndex.url(), icon: CalendarDays },
            { title: 'Blog Posts', href: postsIndex.url(), icon: Newspaper },
            { title: 'Partners', href: partnersIndex.url(), icon: Building2 },
        );
    }

    if (role === 'admin' || role === 'finance') {
        mainNavItems.push({
            title: 'Donations',
            href: donationsIndex.url(),
            icon: CircleDollarSign,
        });
    }

    if (role === 'admin') {
        mainNavItems.push(
            { title: 'Inquiries', href: inquiriesIndex.url(), icon: Handshake },
            { title: 'Messages', href: messagesIndex.url(), icon: Mail },
            {
                title: 'Newsletter',
                href: newsletterIndex.url(),
                icon: Megaphone,
            },
            { title: 'Users', href: usersIndex.url(), icon: Users },
            { title: 'Settings', href: settingsEdit.url(), icon: Settings },
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
