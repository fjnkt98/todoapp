import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { MetaFunction } from "@remix-run/cloudflare";
import "./tailwind.css";

export const meta: MetaFunction = () => {
  return [
    {
      title: "ToDo App powered by Remix + Supabase",
    },
    {
      name: "description",
      content: "ToDo App powered by Remix + Supabase",
    },
  ];
};

export default function App() {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="px-2 py-1">
          <h1 className="text-xl font-sans">ToDo App</h1>
        </div>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
