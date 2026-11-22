import { Link } from "react-router";
import type { EventItem } from "../types/event";

type EventCardProps = {
  event: EventItem;
};

export const EventCard = ({ event }: EventCardProps) => {
  return (
    <article className="event-card">
      {event.imageUrl && (
        <img
          className="event-card__image"
          src={event.imageUrl}
          alt={`Sündmuse „${event.title}” foto`}
          loading="lazy"
        />
      )}

      <h3>
        <Link to={`/sundmused/${event.id}`}>
          {event.title}
        </Link>
      </h3>

      <p className="location">{event.location}</p>

      <p className="event-card__time">
        {new Date(event.startsAt).toLocaleString("et-EE", {
          day: "numeric",
          month: "long",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </article>
  );
};