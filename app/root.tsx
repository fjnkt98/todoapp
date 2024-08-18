import {
  Links,
  Link,
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
      <body className="min-w-80">
        <div className="pl-3 pt-2 pb-1 bg-blue-500 text-white">
          <h1 className="text-xl font-sans">
            <Link to="/">ToDo App</Link>
          </h1>
        </div>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
