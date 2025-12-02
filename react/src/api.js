// react/src/api.js
//const API_URL = "http://localhost:3000/api/v1/gardens";

const API_URL = "/api/v1/gardens";

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const msg = text || res.statusText || "API error";
    throw new Error(msg);
  }
  return res.json();
}

export async function getGardens() {
  const response = await fetch(API_URL);
  return handleResponse(response);
}

export async function createGarden(garden) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(garden),
  });
  return handleResponse(response);
}

export async function updateGarden(id, garden) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(garden),
  });
  return handleResponse(response);
}

export async function deleteGarden(id) {
  const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  return handleResponse(response);
}
