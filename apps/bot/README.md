# @codesnip/bot

CodeSnip's Discord Bot, letting users query the code snippets they've published on the website directly from Discord.

## Features

- `/my-snippets`: View a list of your most recently published snippets (requires connecting your Discord account on the website's `/settings` page first).
- `/snippet <id>`: View the details of a snippet by its id (title, description, language, tags, code, likes/comments count).

All queries go through the `/api/bot/*` endpoints provided by `apps/web`, using `BOT_API_SECRET` for service-to-service authentication instead of a regular user session login.

## Development

1. Copy `.env.example` to `.env` and fill in:
   - `DISCORD_BOT_TOKEN`: Token generated from the Discord Developer Portal > Bot tab.
   - `DISCORD_CLIENT_ID`: The Application's Client ID (same value as `DISCORD_CLIENT_ID` in `apps/web`).
   - `API_BASE_URL`: The CodeSnip website URL (defaults to `http://localhost:3000` for local development).
   - `BOT_API_SECRET`: **Must be identical to `BOT_API_SECRET` in `apps/web/.env`**.
2. Install dependencies (from the project root): `pnpm install`
3. Register slash commands with Discord (run once whenever commands are added/changed):
   ```
   pnpm --filter @codesnip/bot run deploy
   ```
4. Start dev mode:
   ```
   pnpm --filter @codesnip/bot run dev
   ```

## Directory Structure

```
src/
├── index.ts                 # Entry point: logs in and registers events
├── deploy-commands.ts        # Script to register slash commands with Discord
├── commands/                 # One file per slash command
├── events/                   # Discord Client events (ready, interactionCreate)
├── lib/                      # env loading, API client, Discord Client instance
└── utils/                    # Embed formatting and other utilities
```
