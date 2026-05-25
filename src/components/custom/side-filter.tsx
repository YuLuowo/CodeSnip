import MultiSelect from "@/components/custom/multi-select";
import { Field, FieldDescription, FieldGroup, FieldSeparator, FieldSet } from "@/components/ui/field";

export default function SideFilter() {
    return (
        <div className="flex-[1] flex flex-col gap-4 border border-accent min-h-screen p-4">
            <div className="flex items-center justify-between">
                <h4 className="text-xl font-semibold">Filter by</h4>
                {/** Reset Button */}
            </div>

            <FieldSet className="pt-6">
                <FieldGroup>
                    <FieldSeparator />

                    <Field>
                        <FieldDescription>Tags</FieldDescription>
                        <MultiSelect grid="row" />
                    </Field>

                    <FieldSeparator />



                    <FieldSeparator />
                </FieldGroup>
            </FieldSet>

        </div>
    )
}