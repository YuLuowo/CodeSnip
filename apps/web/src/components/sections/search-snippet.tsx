import SideFilter from "@/components/custom/filter/side-filter";
import Snippets from "@/components/custom/snippet/list";

export default function SearchSnippet() {
    return (
        <section className="flex flex-col md:flex-row justify-center gap-4 w-full max-w-7xl p-4 pt-8">
            <SideFilter />
            <Snippets />
        </section>
    )
}