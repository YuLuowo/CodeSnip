export async function fetcher<T>(url: string): Promise<T> {
    const res = await fetch(url);

    if (!res.ok) {
        const error = new Error("Failed to fetch data");
        (error as Error & { info?: unknown; status?: number }).info = await res.json().catch(() => undefined);
        (error as Error & { info?: unknown; status?: number }).status = res.status;
        throw error;
    }

    return res.json();
}
