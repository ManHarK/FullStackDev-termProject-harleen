// react/src/api.js
//const API_URL = "http://localhost:3000/api/v1/gardens";


const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const API_BASE_URL = isProduction ? '' : 'http://localhost:3000';
const API_URL = `${API_BASE_URL}/api/v1/gardens`;

console.log('Environment:', isProduction ? 'Production' : 'Development');
console.log('API Base URL:', API_BASE_URL);
console.log('Full API URL:', API_URL);

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const msg = text || res.statusText || "API error";
    console.error('API Error:', { status: res.status, statusText: res.statusText, message: msg });
    throw new Error(msg);
  }
  return res.json();
}

export async function getGardens() {
  try {
    console.log('Fetching from:', API_URL);
    const response = await fetch(API_URL);
    return await handleResponse(response);
  } catch (err) {
    console.error('getGardens error:', err);
    throw err;
  }
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