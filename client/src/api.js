// Thin wrapper around fetch that injects Basic Auth and throws on non-2xx
export async function apiFetch(path, creds, options = {}) {
  const headers = {
    Authorization: 'Basic ' + btoa(`${creds.user}:${creds.pass}`),
    'Content-Type': 'application/json',
    ...options.headers,
  };
  const res = await fetch(path, { ...options, headers });
  return res;
}
