interface MenuItem {
    title: string;
    links: {
        text: string;
        url: string;
    }[];
}

interface FooterProps {
    tagline?: string;
    menuItems?: MenuItem[];
    copyright?: string;
    bottomLinks?: {
        text: string;
        url: string;
    }[];
}

const Footer = ({
    tagline = "Share What You Build.",
    menuItems = [
        {
            title: "Product",
            links: [
                { text: "Explore Snippets", url: "#" },
                { text: "Create Snippet", url: "#" },
                { text: "My Snippets", url: "#" },
                { text: "Docs", url: "#" },
            ],
        },
        {
            title: "Resources",
            links: [
                { text: "Terms of Service", url: "#" },
                { text: "Privacy Policy", url: "#" },
            ],
        },
        {
            title: "Social",
            links: [
                { text: "GitHub", url: "#" },
                { text: "Discord", url: "#" },
            ],
        },
    ],
    copyright = "© 2025 ImagineYuLuo. All rights reserved.",
}: FooterProps) => {
    return (
        <section className="flex flex-col items-center p-8">
            <div className="container">
                <footer>
                    <div className="grid grid-cols-2 gap-8 lg:grid-cols-5">
                        <div className="col-span-2 mb-8 lg:mb-0">
                            <div className="flex items-center gap-2 lg:justify-start">
                                <h2 className="text-2xl font-bold">Code Snippet</h2>
                            </div>
                            <p className="mt-4 font-semibold">{tagline}</p>
                        </div>
                        {menuItems.map((section, sectionIdx) => (
                            <div key={sectionIdx}>
                                <h3 className="mb-4 font-bold">{section.title}</h3>
                                <ul className="text-muted-foreground space-y-4">
                                    {section.links.map((link, linkIdx) => (
                                        <li
                                            key={linkIdx}
                                            className="hover:text-primary font-medium"
                                        >
                                            <a href={link.url}>{link.text}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div
                        className="text-muted-foreground mt-24 flex justify-center gap-4 border-t pt-8 font-medium">
                        <p>{copyright}</p>
                    </div>
                </footer>
            </div>
        </section>
    );
};

export { Footer };
