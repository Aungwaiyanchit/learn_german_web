import { auth } from "@/auth";

export async function protectRoute(req: Request) {
  console.log(req);
  const session = await auth();

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return null; // Continue with the request
}
