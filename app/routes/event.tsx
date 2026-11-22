import {
  data,
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useRouteError,
} from "react-router";

import type { Route } from "./+types/event";

import {
  EventNotFoundError,
  fetchEvent,
} from "../../src/api/events";

import { EventCard } from "../../src/components/EventCard";
import { Footer } from "../../src/components/Footer";
import { PageHeader } from "../../src/components/PageHeader";
import { useTheme } from "../../src/hooks/useTheme";

export const loader = async ({
  params,
  request,
}: Route.LoaderArgs) => {
  const id = params.id;

  if (
    !id ||
    !/^\d+$/.test(id) ||
    !Number.isSafeInteger(Number(id)) ||
    Number(id) <= 0
  ) {
    throw data("Sündmust ei leitud.", {
      status: 404,
    });
  }

  try {
    return await fetchEvent(Number(id), request.signal);
  } catch (error) {
    if (error instanceof EventNotFoundError) {
      throw data("Sündmust ei leitud.", {
        status: 404,
      });
    }

    throw error;
  }
};

export default function EventRoute() {
  const event = useLoaderData<typeof loader>();
  const { theme } = useTheme();

  return (
    <div className={`app theme-${theme}`}>
      <title>{event.title} | Ajarada</title>

      <PageHeader />

      <main>
        <p>
          <Link to="/">← Tagasi kavasse</Link>
        </p>

        <EventCard event={event} />
      </main>

      <Footer organization="Rapla Ajalooklubi" />
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const { theme } = useTheme();

  const isNotFound =
    isRouteErrorResponse(error) &&
    error.status === 404;

  return (
    <div className={`app theme-${theme}`}>
      <PageHeader />

      <main>
        <h2>
          {isNotFound
            ? "Sündmust ei leitud"
            : "Sündmuse laadimine ebaõnnestus"}
        </h2>

        <p role="alert">
          {isNotFound
            ? "Sellise ID-ga sündmust ei ole olemas."
            : "Sündmuse laadimisel tekkis viga."}
        </p>

        <Link to="/">Tagasi kavasse</Link>
      </main>

      <Footer organization="Rapla Ajalooklubi" />
    </div>
  );
}