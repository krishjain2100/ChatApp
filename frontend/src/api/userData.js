export default async function userData(accessToken) {
  const res = await fetch("http://localhost:3000/auth/main", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok)  throw new Error(`Fetch failed with status ${res.status}`);
  return res.json();  // this promise resolves with your `{ username, data }`
}
