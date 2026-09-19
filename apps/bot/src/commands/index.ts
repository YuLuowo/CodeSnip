import type { BotCommand } from "../lib/discord-client.js";
import mySnippets from "./my-snippets.js";
import snippet from "./snippet.js";

const commands: BotCommand[] = [mySnippets, snippet];

export default commands;
