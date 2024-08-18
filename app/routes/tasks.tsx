import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import { createSupabaseServerClient } from "~/supabase.server";
import { useLoaderData, Link } from "@remix-run/react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(timezone);
dayjs.extend(utc);

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const { supabaseClient, headers } = createSupabaseServerClient(
    request,
    context
  );
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (user == null) {
    return redirect("/sign-in", { headers });
  }

  const { data, error } = await supabaseClient.from("tasks").select();
  if (error) {
    throw new Response("failed to fetch data", { headers, status: 500 });
  }

  return json({ data }, { headers });
};

function formatDate(date: string | null): string {
  if (date == null) {
    return "";
  }
  return dayjs(date).tz("Asia/Tokyo").format("YYYY/MM/DD");
}

function formatStatus(status: string): string {
  switch (status) {
    case "not started":
      return "未対応";
    case "wip":
      return "対応中";
    case "done":
      return "対応済";
    default:
      return "";
  }
}

export default function Tasks() {
  const { data } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col sm:flex-row">
      <div className="flex flex-row items-center sm:flex-col justify-between sm:justify-start width-full sm:width-1/4 sm:min-w-32 px-1 sm:px-6 sm:gap-1 gap-6 py-2">
        <Link
          className="border border-orange-400 rounded-xl shadow-sm text-sm sm:text-md shadow-gray-500 px-2 py-1"
          to="/tasks/new"
        >
          + 新規タスク
        </Link>
        <Link className="underline text-sm" to="/sign-out">
          サインアウト
        </Link>
      </div>
      <div className="px-1 py-1 w-full mx-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-sm px-1 py-1 text-white bg-blue-700">ID</th>
              <th className="text-sm px-1 py-1 text-white bg-blue-700">
                タイトル
              </th>
              <th className="text-sm px-1 py-1 text-white bg-blue-700">状態</th>
              <th className="text-sm px-1 py-1 text-white bg-blue-700">締切</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.id}>
                <td className="text-sm px-1 py-2 text-center border-b border-gray-600">
                  {d.id}
                </td>
                <td className="text-sm px-1 py-2 text-left border-b border-gray-600 truncate">
                  {d.title}
                </td>
                <td className="text-sm px-1 py-2 text-center border-b border-gray-600 max-w-4">
                  {formatStatus(d.status)}
                </td>
                <td className="text-sm px-1 py-2 text-center border-b border-gray-600 max-w-12">
                  {formatDate(d.deadline)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
