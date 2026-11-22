import type { ReactNode } from "react";
import {
  Link,
  Outlet,
  isRouteErrorResponse,
  useRouteError,
} from "react-router";

import { Footer } from "../../../src/components/Footer";
import { PageHeader } from "../../../src/components/PageHeader";
import { useTheme } from "../../../src/hooks/useTheme";

const AdminFrame = ({ children }: { children: ReactNode }) => {
  const { theme } = useTheme();

  return (
    <div className={`app theme-${theme}`}>
      <meta name="robots" content="noindex, nofollow" />

      <PageHeader />

      <main className="app__main">
        <p className="admin-warning" role="note">
          Haldusvaatel ei ole autentimist: igaüks, kes aadressi teab, saab
          kava muuta. Avalik kava uueneb alles pärast uut buildi ja juurutust.
        </p>

        {children}
      </main>

      <Footer organization="Rapla Ajalooklubi" />
    </div>
  );
};

export default function AdminLayout() {
  return (
    <AdminFrame>
      <Outlet />
    </AdminFrame>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  let message = "Haldusvaate laadimine ebaõnnestus.";

  if (isRouteErrorResponse(error) && error.status === 404) {
    message = "Sündmust ei leitud.";
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <AdminFrame>
      <title>Viga | Haldus</title>
      <p role="alert">{message}</p>
      <Link to="/admin">Tagasi nimekirja</Link>
    </AdminFrame>
  );
}