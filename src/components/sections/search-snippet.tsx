import SideFilter from "@/components/custom/side-filter";
import Snippets from "@/components/custom/snippets";

export default function SearchSnippet() {
    return (
        <section className="flex flex-col md:flex-row justify-center gap-4 w-full max-w-6xl p-4 pt-2">
            <SideFilter />
            <Snippets />
        </section>
    )
}