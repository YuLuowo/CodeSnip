"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Search } from "lucide-react";
import { useTranslations } from "use-intl";

export function SearchCommand() {
    const [open, setOpen] = React.useState(false);
    const t = useTranslations("SearchCommand");

    return (
        <div className="flex flex-col gap-4">
            <Button onClick={() => setOpen(true)} variant="outline" className="w-fit h-8">
                <Search /> {t("title")}
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <Command>
                    <CommandInput placeholder="輸入關鍵字..." />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="建議">
                            <CommandItem>Calendar</CommandItem>
                            <CommandItem>Search Emoji</CommandItem>
                            <CommandItem>Calculator</CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </CommandDialog>
        </div>
    )
}