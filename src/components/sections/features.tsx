import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Code2, FolderOpen, Share2} from "lucide-react";

export function Features() {
    return (
        <section className="flex flex-col items-center justify-center gap-4 px-6 md:px-20 py-8 md:py-16">
            <h1 className="text-3xl md:text-4xl font-bold">Features</h1>
            <span className="text-sm md:text-xl max-w-2xl text-center mb-2">
                Hello
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
                <Card className="p-4">
                    <CardHeader>
                        <Code2 className="h-8 w-8 mb-2 text-primary" />
                        <CardTitle>Beautiful Syntax</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                        Highlight and format your snippets automatically, supporting dozens of languages.
                    </CardContent>
                </Card>

                <Card className="p-4">
                    <CardHeader>
                        <FolderOpen className="h-8 w-8 mb-2 text-primary" />
                        <CardTitle>Smart Organization</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                        Group snippets by language, tag, or purpose — find what you need instantly.
                    </CardContent>
                </Card>

                <Card className="p-4">
                    <CardHeader>
                        <Share2 className="h-8 w-8 mb-2 text-primary" />
                        <CardTitle>Share & Collaborate</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                        Share your snippets publicly or privately with teammates and friends.
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}