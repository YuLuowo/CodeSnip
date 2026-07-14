"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { useTranslations } from "use-intl";

interface FavoriteFilterProps {
    inputValue: string;
    setInputValue: (value: string) => void;
    sort: string;
    setSort: (value: string) => void;
    onSearch?: (title: string) => void;
    onSort?: (sort: string) => void;
}

export default function FavoriteFilter({ inputValue, setInputValue, sort, setSort, onSearch, onSort }: FavoriteFilterProps) {
    const t = useTranslations("FavoriteFilter");
    const tSort = useTranslations("FavoriteFilter.sort");

    const handleSearch = () => {
        if (onSearch) onSearch(inputValue);
    };

    const handleSortChange = (value: string) => {
        setSort(value);
        if (onSort) onSort(value);
    };

    return (
        <div className="flex flex-col md:flex-row items-center gap-4 my-4">
            <div className="w-full flex items-center justify-between md:w-auto gap-4">
                <Input
                    placeholder={t("search_placeholder")}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full md:w-xs"
                />
                <Button
                    variant="outline"
                    className="cursor-pointer"
                    onClick={handleSearch}
                >
                    {t("search")}
                </Button>
            </div>

            <Select value={sort} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full md:w-[200px]">
                    <div>{tSort("title")}<SelectValue /></div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="latest">{tSort("latest")}</SelectItem>
                    <SelectItem value="favorites">{tSort("favorites")}</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}