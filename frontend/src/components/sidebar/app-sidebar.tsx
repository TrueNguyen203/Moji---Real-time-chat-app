import * as React from 'react';

import { NavUser } from '@/components/sidebar/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Moon, Sun } from 'lucide-react';
import { Switch } from '../ui/switch';
import CreateNewChat from '@/components/chat/CreateNewChat';
import NewGroupChatModal from '@/components/chat/NewGroupChatModal';
import { SidebarGroupAction, SidebarGroupLabel } from '@/components/ui/sidebar';
import GroupChatList from '@/components/chat/GroupChatList';
import AddFriendModal from '@/components/chat/AddFriendModal';
import DirectMessageList from '@/components/chat/DirectMessageList';
import { useThemeStore } from '@/stores/useThemeStore';
import { useAuthStore } from '@/stores/useAuthStore';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { isDark, toggleTheme } = useThemeStore();
    const { user } = useAuthStore();
    return (
        <Sidebar variant="inset" {...props}>
            {/* Header */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="bg-gradient-primary"
                        >
                            <a href="#">
                                <div className="flex w-full items-center px-2 justify-between">
                                    <h1 className="text-xl font-bold text-white">
                                        Moji
                                    </h1>
                                    <div className="flex items-center gap-2">
                                        <Sun className="size-4 text-white/80" />
                                        <Switch
                                            checked={isDark}
                                            onCheckedChange={toggleTheme}
                                            className="data-[state=checked]:bg-white/80"
                                        />
                                        <Moon className="size-4 text-white/80" />
                                    </div>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            {/* Content */}
            <SidebarContent className="beautiful-scrollbar">
                {/* New Chat */}
                <SidebarGroup>
                    <SidebarGroupContent>
                        <CreateNewChat />
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Group chat */}
                <SidebarGroup>
                    <div className="flex items-center justify-between">
                        <SidebarGroupLabel className="uppercase">
                            Group chat
                        </SidebarGroupLabel>
                        <NewGroupChatModal />
                    </div>
                    <SidebarGroupContent>
                        <GroupChatList />
                    </SidebarGroupContent>
                </SidebarGroup>
                {/* Direct chat */}
                <SidebarGroup>
                    <SidebarGroupLabel className="uppercase">
                        Friends
                    </SidebarGroupLabel>
                    <SidebarGroupAction
                        title="Add Friend"
                        className="cursor-pointer"
                    >
                        <AddFriendModal />
                    </SidebarGroupAction>
                    <SidebarGroupContent>
                        <DirectMessageList />
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            {/* Footer */}
            <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
        </Sidebar>
    );
}
