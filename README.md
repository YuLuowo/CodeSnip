This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app), organized as a [Turborepo](https://turbo.build/repo) monorepo managed with [pnpm](https://pnpm.io).

## Project Structure

```
.
├── apps/
│   └── web/        # the Next.js application (this was the project root before)
├── packages/
│   └── db/         # shared MongoDB connection logic (connectDB) and Mongoose models
├── turbo.json        # Turborepo task pipeline configuration
└── pnpm-workspace.yaml
```

## Getting Started

Install dependencies from the repository root (pnpm is required, npm/yarn are not supported):

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Other common commands (run from the repository root, executed via Turborepo):

```bash
pnpm build   # build all apps
pnpm lint    # lint all apps
pnpm start   # start the production server
```

You can start editing the page by modifying `apps/web/src/app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
