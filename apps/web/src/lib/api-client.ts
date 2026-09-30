/**
 * apiFetch
 * Drop-in replacement for fetch in client-side code.
 * Automatically intercepts HTTP 401 responses and redirects the user
 * to /login?error=session_expired, clearing the stale session.
 */
export async function apiFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const response = await fetch(input, init);

  if (response.status === 401 && typeof window !== "undefined") {
    window.location.href = "/login?error=session_expired";
  }

  return response;
}
