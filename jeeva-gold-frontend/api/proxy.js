const readRequestBody = (req) =>
  new Promise((resolve, reject) => {
    const chunks = [];

    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });

const getProxyHeaders = (headers) => {
  const nextHeaders = { ...headers };

  delete nextHeaders.host;
  delete nextHeaders["content-length"];
  delete nextHeaders.connection;

  return nextHeaders;
};

export default async function handler(req, res) {
  const backendUrl = process.env.BACKEND_API_URL || process.env.VITE_API_URL;

  if (!backendUrl) {
    res.status(500).json({
      message:
        "Backend API URL is not configured. Set BACKEND_API_URL in Vercel to your deployed Strapi backend URL.",
    });
    return;
  }

  // Support Vercel rewrites: if we rewrote /api/:path* to /api/proxy.js,
  // then req.query.path contains the matched segments as a string or array.
  let targetPath = "";
  if (req.query && req.query.path) {
    const p = req.query.path;
    targetPath = Array.isArray(p) ? p.join("/") : p;
  } else {
    const requestUrl = new URL(req.url, "https://frontend.local");
    targetPath = requestUrl.pathname.replace(/^\/api\/?/, "");
  }

  // Clean up "proxy" prefix if Vercel resolved path directly to proxy file
  targetPath = targetPath.replace(/^proxy(\.js)?\/?/, "");

  const requestUrl = new URL(req.url, "https://frontend.local");
  const targetUrl = `${backendUrl.replace(/\/+$/, "")}/api/${targetPath}${requestUrl.search}`;
  const body = ["GET", "HEAD"].includes(req.method) ? undefined : await readRequestBody(req);

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: getProxyHeaders(req.headers),
      body,
    });

    response.headers.forEach((value, key) => {
      if (!["content-encoding", "content-length", "transfer-encoding"].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });

    res.status(response.status).send(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    res.status(502).json({
      message: "Unable to reach backend API",
      detail: error?.message || "Unknown proxy error",
    });
  }
}
