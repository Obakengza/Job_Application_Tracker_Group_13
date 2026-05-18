const API_BASE_URL = "http://127.0.0.1:8000/api";

async function refreshAccessToken() {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) return null;

  const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    return null;
  }

  const data = await response.json();
  localStorage.setItem("access", data.access);
  return data.access;
}

export async function apiRequest(endpoint, options = {}) {
  const { auth = true, ...fetchOptions } = options;
  const token = localStorage.getItem("access");

  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...(auth && token && {
        Authorization: `Bearer ${token}`,
      }),
      ...(fetchOptions.headers || {}),
    },
  });

  if (auth && response.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...fetchOptions,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${newToken}`,
          ...(fetchOptions.headers || {}),
        },
      });
    }
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "API request failed");
  }

  return response.json();
}
