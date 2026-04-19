import { getAdminToken } from "./admin-storage.js";

export const ADMIN_API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

const adminApiUrl = (path) =>
  `${ADMIN_API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export async function adminApiFetch(path, options = {}) {
  const { method = "GET", body, headers = {}, token } = options;
  const authToken = token || getAdminToken();
  const requestHeaders = { ...headers };

  if (body !== undefined) {
    requestHeaders["Content-Type"] = "application/json";
  }
  if (authToken) {
    requestHeaders.Authorization = `Bearer ${authToken}`;
  }

  const requestUrl = adminApiUrl(path);
  let response;
  try {
    response = await fetch(requestUrl, {
      method,
      headers: requestHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    throw new Error(`Unable to reach API at ${requestUrl}`);
  }

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = data?.error || `Request failed (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
