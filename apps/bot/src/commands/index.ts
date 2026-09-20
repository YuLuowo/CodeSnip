import type { BotCommand } from "../lib/discord-client.js";
import mySnippets from "./my-snippets.js";
import snippet from "./snippet.js";
import search from "./search.js";
import profile from "./profile.js";

const commands: BotCommand[] = [mySnippets, snippet, search, profile];

export default commands;
