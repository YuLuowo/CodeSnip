"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "use-intl";
import React from "react";

export function Dashboard() {
    const { data: session } = useSession();
    const t = useTranslations("Dashboard");

    return (
        <div>
            Dashboard page
        </div>
    )
}
