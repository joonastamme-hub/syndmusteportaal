import { useLoaderData } from "react-router";
import type { Route } from "./+types/home";

import { fetchEvents } from "../../src/api/events";
import { EventPortal } from "../../src/components/EventPortal";

export const loader = ({ request }: Route.LoaderArgs) =>
  fetchEvents(request.signal);

export default function Home() {
  const events = useLoaderData<typeof loader>();

  return (
    <>
      <title>Ajarada</title>

      <meta
        name="description"
        content="Raplamaa ajalooõhtud, retked, töötoad ja kohtumised."
      />

      <EventPortal events={events} />
    </>
  );
}