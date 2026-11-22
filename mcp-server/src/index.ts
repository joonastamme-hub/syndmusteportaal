import { loadEnvFile } from "node:process";
import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";

loadEnvFile();

type EventItem = {
  id: number;
  title: string;
  description: string;
  startsAt: string;
  location: string;
  tags: string[];
  url?: string;
  imageUrl?: string;
};

const API_URL = process.env.EVENTS_API_URL;

const fetchEvents = async (): Promise<EventItem[]> => {
  if (!API_URL) {
    throw new Error("EVENTS_API_URL puudub .env failist.");
  }

  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`API vastas veaga (${response.status}).`);
  }

  return (await response.json()) as EventItem[];
};

const createServer = (): McpServer => {
  const server = new McpServer({
    name: "events",
    version: "1.0.0",
  });

  server.registerTool(
    "get-events",
    {
      description: "Tagastab kõik sündmused sündmuste API-st.",
    },
    async () => {
      try {
        const events = await fetchEvents();

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(events, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text:
                error instanceof Error
                  ? error.message
                  : "Sündmuste laadimine ebaõnnestus.",
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "search-events",
    {
      description:
        "Otsib sündmusi pealkirja, kirjelduse, asukoha ja siltide järgi.",
      inputSchema: z.object({
        query: z.string().min(1).describe("Otsingusõna või fraas"),
      }),
    },
    async ({ query }) => {
      try {
        const events = await fetchEvents();
        const normalizedQuery = query.trim().toLowerCase();

        const matches = events.filter((event) => {
          const searchableText = [
            event.title,
            event.description,
            event.location,
            ...event.tags,
          ]
            .join(" ")
            .toLowerCase();

          return searchableText.includes(normalizedQuery);
        });

        return {
          content: [
            {
              type: "text",
              text:
                matches.length > 0
                  ? JSON.stringify(matches, null, 2)
                  : "Sobivaid sündmusi ei leitud.",
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text:
                error instanceof Error
                  ? error.message
                  : "Sündmuste otsimine ebaõnnestus.",
            },
          ],
          isError: true,
        };
      }
    },
  );

  return server;
};

void serveStdio(createServer);

console.error("Events MCP server running on stdio");