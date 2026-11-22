import {
  Link,
  redirect,
  type ShouldRevalidateFunctionArgs,
} from "react-router";

import type { Route } from "./+types/edit";

import {
  EventNotFoundError,
  fetchEvent,
  updateEvent,
} from "../../../src/api/events";
import { EventForm } from "../../../src/components/EventForm";
import { formDataToDraft } from "../../../src/lib/form";

export async function clientLoader({
  params,
  request,
}: Route.ClientLoaderArgs) {
  if (!/^\d+$/.test(params.id)) {
    throw new Response("Sündmust ei leitud.", {
      status: 404,
    });
  }

  try {
    return {
      event: await fetchEvent(
        Number(params.id),
        request.signal,
      ),
    };
  } catch (error) {
    if (error instanceof EventNotFoundError) {
      throw new Response("Sündmust ei leitud.", {
        status: 404,
      });
    }

    throw error;
  }
}

export async function clientAction({
  params,
  request,
}: Route.ClientActionArgs) {
  const result = await updateEvent(
    Number(params.id),
    formDataToDraft(await request.formData()),
  );

  if (!result.ok) {
    return result;
  }

  return redirect("/admin");
}

// Ebaõnnestunud salvestamine ei muutnud serveris midagi.
// Seetõttu ei ole vaja clientLoaderit uuesti käivitada.
export function shouldRevalidate({
  actionResult,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  if (actionResult?.ok === false) {
    return false;
  }

  return defaultShouldRevalidate;
}

export default function EditEvent({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  return (
    <>
      <title>Muuda sündmust | Haldus</title>

      <p>
        <Link to="/admin">Tagasi nimekirja</Link>
      </p>

      <h2>Muuda sündmust</h2>

      <EventForm
        event={loaderData.event}
        errors={actionData?.errors}
        message={actionData?.message}
        submitLabel="Salvesta muudatused"
      />
    </>
  );
}