import SideFilter from "@/components/custom/side-filter";
import Snippets from "@/components/custom/snippets";

export default function SearchSnippet() {
    return (
        <section className="flex justify-center items-center gap-8 w-full max-w-6xl p-4">
            <SideFilter />
            <Snippets />
        </section>
    )
}