import { getPopularTags } from "@/lib/actions/category";
import Categories from "@/components/sections/categories";

export default async function CategoriesPage() {

    const categories = await getPopularTags();

    return (
        <main className="flex justify-center min-h-screen pt-12">
            <Categories categories={categories} />
        </main>
    );
}