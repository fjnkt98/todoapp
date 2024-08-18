import { redirect, json } from "@remix-run/cloudflare";
import type {
  LoaderFunctionArgs,
  ActionFunctionArgs,
} from "@remix-run/cloudflare";
import { createSupabaseServerClient } from "~/supabase.server";
import { Form, Link, useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { getCurrentTimezoneOffset } from "./tasks_.new";

dayjs.extend(timezone);
dayjs.extend(utc);

export const loader = async ({
  request,
  context,
  params,
}: LoaderFunctionArgs) => {
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

  const id = params.id;
  if (id == undefined) {
    throw new Response("Invalid path param", { headers, status: 404 });
  }

  const { data, error } = await supabaseClient
    .from("tasks")
    .select("id, title, description, status, deadline")
    .eq("id", id);

  if (error) {
    console.log(error);
    throw new Response("Failed to fetch the task", { headers, status: 500 });
  }

  if (data.length === 0) {
    throw new Response("The task not found", { headers, status: 404 });
  }

  return json({ data: data[0] }, { headers });
};

export const action = async ({
  request,
  context,
  params,
}: ActionFunctionArgs) => {
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

  const id = params.id;
  if (id == undefined) {
    throw new Response("Invalid path param", { headers, status: 404 });
  }

  const formData = await request.formData();
  const title = formData.get("title")?.toString();

  if (title == null) {
    throw new Response("title is required", { headers, status: 400 });
  }

  const description = formData.get("description")?.toString();
  const status = formData.get("status")?.toString();
  const naiveDeadline = formData.get("deadline")?.toString();
  const timezone = formData.get("timezone") ?? "+00:00";
  const deadline =
    naiveDeadline == undefined || naiveDeadline === ""
      ? null
      : naiveDeadline + timezone;

  const { error } = await supabaseClient
    .from("tasks")
    .update({
      title,
      description,
      status,
      deadline,
    })
    .eq("id", id);
  if (error) {
    console.log(error);
    throw new Response("Failed to update the task", { headers, status: 500 });
  }

  return redirect("/tasks", { headers });
};

export default function Task() {
  const { data } = useLoaderData<typeof loader>();
  const deadline =
    data.deadline == null
      ? undefined
      : dayjs(data.deadline).tz("Asia/Tokyo").format("YYYY-MM-DDTHH:mm");

  return (
    <div className="px-1 py-2 sm:px-4 lg:px-6">
      <Form method="post">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            タイトル:
            <input
              type="text"
              name="title"
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={data.title}
              required
            ></input>
          </label>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            説明:
            <textarea
              name="description"
              rows={4}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={data.description ?? ""}
              required
            ></textarea>
          </label>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            状態:
            <select
              name="status"
              className="w-full px-2 py-1 appearance-none border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={data.status}
              required
            >
              <option value="not started">未対応</option>
              <option value="wip">対応中</option>
              <option value="done">対応済</option>
            </select>
          </label>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            締切:
            <input
              type="datetime-local"
              name="deadline"
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={deadline}
            ></input>
          </label>
          <input
            type="hidden"
            name="timezone"
            value={getCurrentTimezoneOffset()}
          />
        </div>

        <div className="flex flex-row justify-between items-center my-5">
          <Link
            to={`/tasks/${data.id}`}
            className="px-2 py-1 border border-gray-500 rounded-md"
          >
            キャンセル
          </Link>
          <button
            type="submit"
            className="px-6 py-1 border bg-blue-500 text-white rounded-md border-blue-900"
          >
            保存
          </button>
        </div>
      </Form>
    </div>
  );
}
