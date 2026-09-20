const languageLabels: Record<string, string> = {
    javascript: "JavaScript",
    typescript: "TypeScript",
    python: "Python",
    java: "Java",
    c: "C",
    cpp: "C++",
    csharp: "C#",
    go: "Go",
    php: "PHP",
    ruby: "Ruby",
    swift: "Swift",
    kotlin: "Kotlin",
    rust: "Rust",
    dart: "Dart",
    scala: "Scala",
    r: "R",
    html: "HTML",
    css: "CSS",
    scss: "SCSS / SASS",
    json: "JSON",
    markdown: "Markdown",
    bash: "Bash / Shell",
    powershell: "PowerShell",
    sql: "SQL",
    yaml: "YAML",
    xml: "XML",
    dockerfile: "Dockerfile",
    graphql: "GraphQL",
};

export function getLanguageLabel(language: string): string {
    if (!language) return "";
    return languageLabels[language] ?? language;
}

const tagLabels: Record<string, string> = {
    algorithm: "Algorithm",
    data_structure: "Data Structure",
    ui_component: "UI Component",
    template: "Template",
    leetcode: "LeetCode",
    project_template: "Project Template",
    examples: "Examples",
    learning_resources: "Learning Resources",
    frontend: "Frontend",
    backend: "Backend",
};

export function getTagLabel(tag: string): string {
    if (!tag) return "";
    return tagLabels[tag] ?? tag;
}
