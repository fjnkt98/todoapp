import { redirect } from "@remix-run/cloudflare";
import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { createSupabaseServerClient } from "~/supabase.server";
import { Form, Link } from "@remix-run/react";

export const action = async ({ request, context }: ActionFunctionArgs) => {
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

  const formData = await request.formData();
  const title = formData.get("title")?.toString();

  if (title == null) {
    throw new Response("title is required", { headers, status: 400 });
  }

  const description = formData.get("description")?.toString();
  const status = formData.get("status")?.toString();
  const deadline = formData.get("deadline")?.toString();

  const { error } = await supabaseClient.from("tasks").insert({
    title,
    description,
    status,
    deadline,
    user_id: user.id,
  });

  if (error) {
    console.log(error);
    throw new Response("failed to insert task", { headers, status: 500 });
  }

  return redirect(`/tasks`, { headers });
};

export default function NewTask() {
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
              required
              defaultValue={"not started"}
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
              required
            ></input>
          </label>
        </div>

        <div className="flex flex-row justify-between items-center my-5">
          <Link
            to="/tasks"
            className="px-2 py-1 border border-gray-500 rounded-md"
          >
            キャンセル
          </Link>
          <button
            type="submit"
            className="px-6 py-1 border bg-blue-500 text-white rounded-md border-blue-900"
          >
            作成
          </button>
        </div>
      </Form>
    </div>
  );
}
