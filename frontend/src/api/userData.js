import { API_ENDPOINTS } from '../config/constants.js';

export default async function userData(accessToken) {
  const res = await fetch(API_ENDPOINTS.AUTH.MAIN, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok)  throw new Error(`Fetch failed with status ${res.status}`);
  return res.json();
}
