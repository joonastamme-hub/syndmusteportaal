import type { Config } from "@react-router/dev/config";
import { loadEnv } from "vite";

const fileEnv = loadEnv("production", process.cwd(), "");

const API_URL = (
  process.env.VITE_API_URL ??
  fileEnv.VITE_API_URL
)?.replace(/\/+$/, "");

type EventSummary = {
  id: number;
};

const getEventPaths = async (): Promise<string[]> => {
  if (!API_URL) {
    throw new Error(
      "SSG build ebaõnnestus: VITE_API_URL puudub.",
    );
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}/api/events`);
  } catch {
    throw new Error(
      "SSG build ebaõnnestus: API-ga ei saanud ühendust.",
    );
  }

  if (!response.ok) {
    throw new Error(
      `SSG build ebaõnnestus: API vastas veaga (${response.status}).`,
    );
  }

  const events = (await response.json()) as EventSummary[];

  return events.map(
    (event) => `/sundmused/${event.id}`,
  );
};

export default {
  ssr: false,

  async prerender() {
    const eventPaths = await getEventPaths();

    return [
      "/",
      "/korraldajast",
      ...eventPaths,
    ];
  },
} satisfies Config;