# @codesnip/bot

CodeSnip's Discord Bot, letting users query the code snippets they've published on the website directly from Discord.

## Features

- `/my-snippets`: View a list of your most recently published snippets (requires connecting your Discord account on the website's `/settings` page first).
- `/snippet <id>`: View the details of a snippet by its id (title, description, language, tags, code, likes/comments count).
- `/search <keyword>`: Search public snippets by keyword. This command does not require connecting a Discord account and only returns public snippets, even if a matching private snippet belongs to the requester.
- `/profile [username]`: View a CodeSnip profile. Without `username`, shows your own profile (requires connecting your Discord account first). With `username`, shows anyone's public profile without requiring a linked account. Includes bio, website/GitHub links, snippets/followers/following counts, top 3 languages (with a text-based progress bar), top 5 tags, a featured (most liked) snippet, and the account's joined date.

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
