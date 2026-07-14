import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useTranslations } from "use-intl";
import { useSession } from "next-auth/react";

interface Profile {
    bio: string;
    website: string;
    githubUrl: string;
}

interface UserInfo {
    name: string;
    username: string;
    image?: string;
}

export function useUserProfile(userId: string) {
    const { update } = useSession();
    const [userInfo, setUserInfo] = useState<UserInfo>({ name: "", username: "", image: "" });
    const [profile, setProfile] = useState<Profile>({ bio: "", website: "", githubUrl: "" });
    const [error, setError] = useState<string | null>(null);
    const [isDirty, setIsDirty] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const t = useTranslations("Settings.profile");

    useEffect(() => {
        if (!userId) return;
        fetch(`/api/users/${userId}/profile`)
            .then(res => res.json())
            .then(data => {
                setUserInfo(data.user);
                setProfile(data.profile);
            });
    }, [userId]);

    const updateProfile = (field: keyof Profile, value: string) => {
        setProfile(prev => ({ ...prev, [field]: value }));
        setIsDirty(true);
    };

    const updateUserInfo = (field: keyof UserInfo, value: string) => {
        setUserInfo(prev => ({ ...prev, [field]: value }));
        setIsDirty(true);
    };

    const save = async () => {
        setIsSaving(true);
        setError(null);
        try {
            const res = await fetch(`/api/users/${userId}/profile`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...profile, username: userInfo.username }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error);
                return;
            }

            setUserInfo(data.user);
            setProfile(data.profile);
            setIsDirty(false);
            toast.success(t("save_success"));

            await update({ username: data.user.username });
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setIsSaving(false);
        }
    };

    return { userInfo, profile, error, isDirty, isSaving, updateProfile, updateUserInfo, save };
}