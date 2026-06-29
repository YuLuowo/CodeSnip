import User from "@/models/User";

const reservedUsernames = [
    "admin",
    "api",
    "login",
    "logout",
    "settings",
    "user",
    "users",
    "search",
    "explore",
    "profile",
    "new",
];

export function normalizeUsername(username: string) {
    return username
        .trim()
        .toLowerCase();
}

export function isValidUsername(username: string) {
    return /^[a-z0-9][a-z0-9-]{2,19}$/.test(username);
}

export async function isUsernameAvailable(username: string) {
    username = normalizeUsername(username);

    if (!isValidUsername(username)) {
        return false;
    }

    if (reservedUsernames.includes(username)) {
        return false;
    }

    const existed = await User.exists({
        username,
    });

    return !existed;
}

export async function generateUsername(name: string) {
    const base =
        name
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "") || "user";

    while (true) {
        const random = Math.floor(
            100000 + Math.random() * 900000
        );

        const username = `${base}-${random}`;

        const available = await isUsernameAvailable(
            username
        );

        if (available) {
            return username;
        }
    }
}