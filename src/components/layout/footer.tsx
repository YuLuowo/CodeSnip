import { getTranslations } from "next-intl/server";

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
}

const Footer = async ({
                          tagline,
                          menuItems,
                          copyright,
                      }: FooterProps) => {

    const t = await getTranslations("Footer");
    const tProduct = await getTranslations("Footer.product");
    const tResources = await getTranslations("Footer.resources");
    const tSocial = await getTranslations("Footer.social");

    tagline ??= t("desc");

    menuItems ??= [
        {
            title: tProduct("title"),
            links: [
                { text: tProduct("explore"), url: "#" },
                { text: tProduct("create"), url: "#" },
                { text: tProduct("my_snippet"), url: "#" },
                { text: tProduct("docs"), url: "#" },
            ],
        },
        {
            title: tResources("title"),
            links: [
                { text: tResources("terms"), url: "#" },
                { text: tResources("privacy"), url: "#" },
            ],
        },
        {
            title: tSocial("title"),
            links: [
                { text: tSocial("github"), url: "#" },
                { text: tSocial("discord"), url: "#" },
            ],
        },
    ];

    copyright ??= `© ${new Date().getFullYear()} ImagineYuLuo. ${t("copyright")}`;

    return (
        <section className="flex flex-col items-center p-8">
            <div className="container">
                <footer>
                    <div className="grid grid-cols-2 gap-8 lg:grid-cols-5">
                        <div className="col-span-2 mb-8 lg:mb-0">
                            <h2 className="text-2xl font-bold">Code Snippet</h2>
                            <p className="mt-4 font-semibold">{tagline}</p>
                        </div>

                        {menuItems.map((section, sectionIdx) => (
                            <div key={sectionIdx}>
                                <h3 className="mb-4 font-bold">{section.title}</h3>
                                <ul className="text-muted-foreground space-y-4">
                                    {section.links.map((link, linkIdx) => (
                                        <li key={linkIdx} className="hover:text-primary font-medium">
                                            <a href={link.url}>{link.text}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="text-muted-foreground mt-24 flex justify-center gap-4 border-t pt-8 font-medium">
                        <p>{copyright}</p>
                    </div>
                </footer>
            </div>
        </section>
    );
};

export { Footer };