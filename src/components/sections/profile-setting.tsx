"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { User, Globe, Github, Bell, AlertCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarProvider,
} from "@/components/ui/sidebar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useTranslations } from "use-intl";

export default function SettingsPage() {
    const { data: session } = useSession();
    const userId = session?.user?.id ?? "";
    const t = useTranslations("Settings");
    const tProfile = useTranslations("Settings.profile");
    const [tab, setTab] = useState<Tab>("profile");
    
    const {
        userInfo,
        profile,
        error,
        isDirty,
        isSaving,
        updateProfile,
        updateUserInfo,
        save,
    } = useUserProfile(userId);

    const initials = userInfo.name
        ? userInfo.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "?";

    type Tab = "profile" | "notifications";
    const NAV: { id: Tab; label: string; icon: React.ReactNode }[] = [
        { id: "profile",       label: t("profile.title"),       icon: <User size={16} /> },
        { id: "notifications", label: t("notifications.title"), icon: <Bell size={16} /> },
    ];

    return (
        <SidebarProvider>
            <div className="flex flex-col md:flex-row justify-center min-h-screen w-full max-w-7xl mx-auto">
                <Sidebar collapsible="none" className="bg-background py-2 md:py-8 w-auto md:min-w-64 px-8 md:px-0">
                    <SidebarContent>
                        <SidebarGroup className="border shadow-sm rounded-sm p-4">
                            <div className="flex items-center gap-4 mb-2">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={userInfo.image} alt={userInfo.name} />
                                    <AvatarFallback>{initials}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium">{userInfo.name || "—"}</p>
                                    <p className="text-xs text-muted-foreground font-mono mt-0.5">
                                        @{userInfo.username || "…"}
                                    </p>
                                </div>
                            </div>
                            <SidebarGroupLabel className="text-sm">{t("account")}</SidebarGroupLabel>
                            <SidebarMenu>
                                {NAV.map(({ id, label, icon }) => (
                                    <SidebarMenuItem key={id}>
                                        <SidebarMenuButton
                                            isActive={tab === id}
                                            onClick={() => setTab(id)}
                                            className="px-6 cursor-pointer"
                                        >
                                            {icon}
                                            <span>{label}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroup>
                    </SidebarContent>
                </Sidebar>

                <main className="flex-1 min-h-screen px-8 py-4 md:py-8 max-w-2xl space-y-6">
                    {tab === "profile" && (
                        <>
                            <Card className="bg-background rounded-sm">
                                <CardHeader>
                                    <CardTitle>{tProfile("public_profile")}</CardTitle>
                                    <CardDescription>
                                        {tProfile("profile_desc")}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="username">{tProfile("username")}</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-mono select-none">
                                                @
                                            </span>
                                            <Input
                                                id="username"
                                                value={userInfo.username}
                                                onChange={(e) => updateUserInfo("username", e.target.value)}
                                                className="pl-7 font-mono"
                                                placeholder={tProfile("username_placeholder")}
                                                maxLength={20}
                                            />
                                        </div>
                                        {error && (
                                            <Alert variant="destructive" className="py-2 px-3">
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertDescription>{error}</AlertDescription>
                                            </Alert>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            {tProfile("username_desc")}
                                        </p>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="bio">{tProfile("bio")}</Label>
                                        <Textarea
                                            id="bio"
                                            value={profile.bio}
                                            onChange={(e) => updateProfile("bio", e.target.value)}
                                            maxLength={200}
                                            rows={3}
                                            className="resize-none"
                                            placeholder={tProfile("bio_placeholder")}
                                        />
                                        <p className={`text-xs text-right ${profile.bio.length > 170 ? "text-amber-500" : "text-muted-foreground"}`}>
                                            {profile.bio.length} / 200
                                        </p>
                                    </div>

                                </CardContent>
                            </Card>

                            <Card className="bg-background rounded-sm">
                                <CardHeader>
                                    <CardTitle>{tProfile("links")}</CardTitle>
                                    <CardDescription>
                                        {tProfile("links_desc")}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="website">{tProfile("website")}</Label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="website"
                                                type="url"
                                                value={profile.website}
                                                onChange={(e) => updateProfile("website", e.target.value)}
                                                className="pl-9"
                                                placeholder="https://yourwebsite.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="github">{tProfile("github")}</Label>
                                        <div className="relative">
                                            <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="github"
                                                type="url"
                                                value={profile.githubUrl}
                                                onChange={(e) => updateProfile("githubUrl", e.target.value)}
                                                className="pl-9"
                                                placeholder="https://github.com/username"
                                            />
                                        </div>
                                    </div>

                                </CardContent>
                            </Card>

                            <div className="flex items-center justify-end border-t pt-4">
                                <Button onClick={save} disabled={!isDirty || isSaving}>
                                    {isSaving ? (
                                        <><Loader2 className="h-4 w-4 animate-spin" /> {tProfile("save_loading")}</>
                                    ) : (
                                        tProfile("save")
                                    )}
                                </Button>
                            </div>
                        </>
                    )}

                    {tab === "notifications" && (
                        <Card className="bg-background rounded-sm">
                            <CardHeader>
                                <CardTitle>Notifications</CardTitle>
                                <CardDescription>Choose how you want to be notified.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">Notification preferences coming soon.</p>
                            </CardContent>
                        </Card>
                    )}
                </main>
            </div>
        </SidebarProvider>
    );
}