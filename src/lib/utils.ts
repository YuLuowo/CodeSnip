import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function capitalizeFirstLetter(inputString: string): string {
    if (!inputString) {
        return "";
    }
    return inputString.charAt(0).toUpperCase() + inputString.slice(1);
}

export function utcToLocalDate(utcDate: string) {
    const date = new Date(utcDate);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const h = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    const s = String(date.getSeconds()).padStart(2, "0");

    return `${y}-${m}-${d} ${h}:${min}:${s}`;
}

// this is bad, but I'm so lazy qwq
export const tagMap: Record<string, string> = {
    "Algorithm": "algorithm",
    "Data Structure": "data_structure",
    "UI Component": "ui_component",
    "Template": "template",
    "LeetCode": "leetCode",
    "Project Template": "project_template",
    "Examples": "examples",
    "Learning Resources": "learning_resources",
    "Frontend": "frontend",
    "Backend": "backend",
};
