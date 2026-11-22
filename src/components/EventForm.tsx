import { useEffect, useRef } from "react";
import { Form } from "react-router";

import type {
  EventItem,
  ValidationErrors,
} from "../types/event";

type EventFormProps = {
  event?: EventItem;
  errors?: ValidationErrors;
  message?: string;
  submitLabel: string;
};

export const EventForm = ({
  event,
  errors,
  message,
  submitLabel,
}: EventFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);

  // Vea korral liigub fookus esimesele vigasele väljale.
  useEffect(() => {
    formRef.current
      ?.querySelector<HTMLElement>('[aria-invalid="true"]')
      ?.focus();
  }, [errors]);

  return (
    <Form
      ref={formRef}
      method="post"
      className="event-form"
    >
      {message && (
        <p className="event-form__message" role="alert">
          {message}
        </p>
      )}

      <div className="event-form__field">
        <label htmlFor="title">Pealkiri</label>

        <input
          id="title"
          name="title"
          defaultValue={event?.title}
          aria-invalid={errors?.title ? true : undefined}
          aria-describedby={
            errors?.title ? "title-error" : undefined
          }
        />

        {errors?.title && (
          <span
            id="title-error"
            className="event-form__error"
          >
            {errors.title}
          </span>
        )}
      </div>

      <div className="event-form__field">
        <label htmlFor="startsAt">Algus</label>

        <input
          id="startsAt"
          name="startsAt"
          type="datetime-local"
          defaultValue={event?.startsAt.slice(0, 16)}
          aria-invalid={errors?.startsAt ? true : undefined}
          aria-describedby={
            errors?.startsAt ? "startsAt-error" : undefined
          }
        />

        {errors?.startsAt && (
          <span
            id="startsAt-error"
            className="event-form__error"
          >
            {errors.startsAt}
          </span>
        )}
      </div>

      <div className="event-form__field">
        <label htmlFor="location">Asukoht</label>

        <input
          id="location"
          name="location"
          defaultValue={event?.location}
        />
      </div>

      <div className="event-form__field">
        <label htmlFor="description">Kirjeldus</label>

        <textarea
          id="description"
          name="description"
          rows={6}
          defaultValue={event?.description}
        />
      </div>

      <div className="event-form__field">
        <label htmlFor="tags">
          Sildid, komadega eraldatud
        </label>

        <input
          id="tags"
          name="tags"
          defaultValue={event?.tags.join(", ")}
        />
      </div>

      <div className="event-form__field">
        <label htmlFor="url">
          Registreerumislink, valikuline
        </label>

        <input
          id="url"
          name="url"
          type="url"
          defaultValue={event?.url}
        />
      </div>

      <div className="event-form__field">
        <label htmlFor="imageUrl">
          Pildi aadress, valikuline
        </label>

        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          defaultValue={event?.imageUrl}
          aria-invalid={errors?.imageUrl ? true : undefined}
          aria-describedby={
            errors?.imageUrl ? "imageUrl-error" : undefined
          }
        />

        {errors?.imageUrl && (
          <span
            id="imageUrl-error"
            className="event-form__error"
          >
            {errors.imageUrl}
          </span>
        )}
      </div>

      <button type="submit" className="button">
        {submitLabel}
      </button>
    </Form>
  );
};