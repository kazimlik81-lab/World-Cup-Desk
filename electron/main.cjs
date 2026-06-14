const { app, BrowserWindow, Menu, shell } = require("electron");
const crypto = require("node:crypto");
const fs = require("node:fs");
const http = require("node:http");
const https = require("node:https");
const net = require("node:net");
const path = require("node:path");
const selfsigned = require("selfsigned");

const DEVELOPMENT_INTERNAL_HTTP_URL = "http://127.0.0.1:15174";
const LOCAL_HTTPS_HOSTNAME = "127.0.0.1";
const LOCALHOST_NAMES = new Set(["127.0.0.1", "localhost", "::1"]);
const HTTPS_PROTOCOL = "https:";
const HTTP_PROTOCOL = "http:";
const CERTIFICATE_DIRECTORY_NAME = "certificates";
const CERTIFICATE_FILE_NAME = "localhost.crt";
const PRIVATE_KEY_FILE_NAME = "localhost.key";
const SERVER_READY_ATTEMPTS = 80;
const SERVER_READY_DELAY_MS = 250;

let trustedLocalHttpsOrigin = null;
let trustedCertificateFingerprint = null;
let bundledServerUrl = null;
let httpsProxyServer = null;

function createBrowserWindow() {
  Menu.setApplicationMenu(null);

  return new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 1024,
    minHeight: 680,
    title: "World Cup Desk",
    backgroundColor: "#f4f7f2",
    show: false,
    webPreferences: {
      allowRunningInsecureContent: false,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true
    }
  });
}

async function createMainWindow() {
  const mainWindow = createBrowserWindow();

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  try {
    writeStartupLog("Starting application runtime.");
    const applicationRuntime = await startApplicationRuntime();
    trustedLocalHttpsOrigin = applicationRuntime.applicationUrl.origin;
    trustedCertificateFingerprint = applicationRuntime.certificateFingerprint;
    enforceNavigationPolicy(mainWindow, applicationRuntime.applicationUrl);
    writeStartupLog(`Loading secure local URL ${applicationRuntime.applicationUrl.toString()}`);
    await mainWindow.loadURL(applicationRuntime.applicationUrl.toString());
  } catch (error) {
    const message = error instanceof Error ? error.message : "Application startup failed.";
    writeStartupLog(`Startup failed: ${message}`);
    if (error instanceof Error && error.stack) {
      writeStartupLog(error.stack);
    }
    await mainWindow.loadURL(buildConfigurationErrorUrl(message));
  }

  return mainWindow;
}

async function startApplicationRuntime() {
  const certificateMaterial = await ensureLocalCertificate();
  const internalApplicationUrl = app.isPackaged
    ? await startBundledNextServer()
    : new URL(DEVELOPMENT_INTERNAL_HTTP_URL);
  const proxyRuntime = await startHttpsProxy(certificateMaterial, internalApplicationUrl);

  return {
    applicationUrl: new URL(`https://${LOCAL_HTTPS_HOSTNAME}:${proxyRuntime.port}/`),
    certificateFingerprint: certificateMaterial.fingerprint
  };
}

async function startBundledNextServer() {
  if (bundledServerUrl) {
    writeStartupLog(`Using existing bundled server ${bundledServerUrl.toString()}`);
    return bundledServerUrl;
  }

  const serverDirectory = path.join(process.resourcesPath, "app-server");
  const serverScriptPath = path.join(serverDirectory, "server.js");
  writeStartupLog(`Bundled server directory: ${serverDirectory}`);

  if (!fs.existsSync(serverScriptPath)) {
    throw new Error("Bundled Next.js server is missing from the Windows application package.");
  }

  const port = await findAvailablePort();
  writeStartupLog(`Starting bundled server on 127.0.0.1:${port}`);
  process.env.HOSTNAME = "127.0.0.1";
  process.env.NODE_ENV = "production";
  process.env.NODE_PATH = path.join(serverDirectory, "dependencies");
  process.env.PORT = String(port);
  require("node:module").Module._initPaths();

  const applicationUrl = new URL(`http://127.0.0.1:${port}/`);
  require(serverScriptPath);
  writeStartupLog("Bundled server module loaded.");
  await waitForHttpServer(applicationUrl);
  writeStartupLog(`Bundled server ready at ${applicationUrl.toString()}`);
  bundledServerUrl = applicationUrl;
  return applicationUrl;
}

async function startHttpsProxy(certificateMaterial, targetUrl) {
  const server = https.createServer(
    {
      cert: certificateMaterial.certificate,
      key: certificateMaterial.privateKey
    },
    (clientRequest, clientResponse) => {
      proxyHttpRequest(targetUrl, clientRequest, clientResponse);
    }
  );

  server.on("upgrade", (clientRequest, clientSocket, head) => {
    proxyUpgradeRequest(targetUrl, clientRequest, clientSocket, head);
  });

  const port = await listenOnAvailablePort(server);
  writeStartupLog(`HTTPS proxy ready on ${LOCAL_HTTPS_HOSTNAME}:${port}`);
  httpsProxyServer = server;
  return { port };
}

function proxyHttpRequest(targetUrl, clientRequest, clientResponse) {
  const upstreamRequest = http.request(
    {
      hostname: targetUrl.hostname,
      method: clientRequest.method,
      path: clientRequest.url,
      port: targetUrl.port,
      protocol: HTTP_PROTOCOL,
      headers: {
        ...clientRequest.headers,
        host: targetUrl.host,
        "x-forwarded-host": clientRequest.headers.host ?? targetUrl.host,
        "x-forwarded-proto": "https"
      }
    },
    (upstreamResponse) => {
      clientResponse.writeHead(upstreamResponse.statusCode ?? 502, upstreamResponse.headers);
      upstreamResponse.pipe(clientResponse);
    }
  );

  upstreamRequest.on("error", () => {
    if (!clientResponse.headersSent) {
      clientResponse.writeHead(502, { "content-type": "text/plain; charset=utf-8" });
    }

    clientResponse.end("World Cup Desk internal server is unavailable.");
  });

  clientRequest.pipe(upstreamRequest);
}

function proxyUpgradeRequest(targetUrl, clientRequest, clientSocket, head) {
  const upstreamSocket = net.connect(Number(targetUrl.port), targetUrl.hostname, () => {
    upstreamSocket.write(buildUpgradeHeader(clientRequest));
    upstreamSocket.write(head);
    clientSocket.pipe(upstreamSocket);
    upstreamSocket.pipe(clientSocket);
  });

  upstreamSocket.on("error", () => {
    clientSocket.destroy();
  });
}

function buildUpgradeHeader(clientRequest) {
  const headerLines = [`${clientRequest.method} ${clientRequest.url} HTTP/${clientRequest.httpVersion}`];

  for (const [headerName, headerValue] of Object.entries(clientRequest.headers)) {
    if (Array.isArray(headerValue)) {
      for (const individualValue of headerValue) {
        headerLines.push(`${headerName}: ${individualValue}`);
      }
      continue;
    }

    if (typeof headerValue === "string") {
      headerLines.push(`${headerName}: ${headerValue}`);
    }
  }

  return `${headerLines.join("\r\n")}\r\n\r\n`;
}

async function ensureLocalCertificate() {
  const certificateDirectoryPath = path.join(app.getPath("userData"), CERTIFICATE_DIRECTORY_NAME);
  const certificatePath = path.join(certificateDirectoryPath, CERTIFICATE_FILE_NAME);
  const privateKeyPath = path.join(certificateDirectoryPath, PRIVATE_KEY_FILE_NAME);

  if (fs.existsSync(certificatePath) && fs.existsSync(privateKeyPath)) {
    writeStartupLog("Using existing local HTTPS certificate.");
    const certificate = fs.readFileSync(certificatePath, "utf8");
    const privateKey = fs.readFileSync(privateKeyPath, "utf8");

    return {
      certificate,
      privateKey,
      fingerprint: calculateCertificateFingerprint(certificate)
    };
  }

  fs.mkdirSync(certificateDirectoryPath, { recursive: true });
  writeStartupLog("Generating local HTTPS certificate.");

  const notBeforeDate = new Date();
  const notAfterDate = new Date(notBeforeDate);
  notAfterDate.setFullYear(notAfterDate.getFullYear() + 10);

  const certificateBundle = await selfsigned.generate(
    [{ name: "commonName", value: "localhost" }],
    {
      algorithm: "sha256",
      keySize: 2048,
      notBeforeDate,
      notAfterDate,
      extensions: [
        { name: "basicConstraints", cA: false, critical: true },
        {
          name: "keyUsage",
          digitalSignature: true,
          keyEncipherment: true,
          critical: true
        },
        { name: "extKeyUsage", serverAuth: true },
        {
          name: "subjectAltName",
          altNames: [
            { type: 2, value: "localhost" },
            { type: 7, ip: "127.0.0.1" },
            { type: 7, ip: "::1" }
          ]
        }
      ]
    }
  );

  fs.writeFileSync(certificatePath, certificateBundle.cert, { encoding: "utf8", mode: 0o600 });
  fs.writeFileSync(privateKeyPath, certificateBundle.private, { encoding: "utf8", mode: 0o600 });

  return {
    certificate: certificateBundle.cert,
    privateKey: certificateBundle.private,
    fingerprint: calculateCertificateFingerprint(certificateBundle.cert)
  };
}

function calculateCertificateFingerprint(certificatePem) {
  const certificateBody = certificatePem
    .replace(/-----BEGIN CERTIFICATE-----/g, "")
    .replace(/-----END CERTIFICATE-----/g, "")
    .replace(/\s+/g, "");
  const certificateBytes = Buffer.from(certificateBody, "base64");

  return crypto.createHash("sha256").update(certificateBytes).digest("hex");
}

async function waitForHttpServer(applicationUrl) {
  for (let attempt = 1; attempt <= SERVER_READY_ATTEMPTS; attempt += 1) {
    if (await isHttpServerReady(applicationUrl)) {
      return;
    }

    await delay(SERVER_READY_DELAY_MS);
  }

  throw new Error(`Bundled server did not become ready at ${applicationUrl.toString()}`);
}

function isHttpServerReady(applicationUrl) {
  return new Promise((resolve) => {
    const readinessRequest = http.get(applicationUrl, (response) => {
      response.resume();
      resolve(Boolean(response.statusCode && response.statusCode < 500));
    });

    readinessRequest.on("error", () => {
      resolve(false);
    });

    readinessRequest.setTimeout(1500, () => {
      readinessRequest.destroy();
      resolve(false);
    });
  });
}

function findAvailablePort() {
  return new Promise((resolve, reject) => {
    const probeServer = net.createServer();
    probeServer.once("error", reject);
    probeServer.listen(0, LOCAL_HTTPS_HOSTNAME, () => {
      const address = probeServer.address();

      if (!address || typeof address === "string") {
        probeServer.close();
        reject(new Error("Could not allocate a local port."));
        return;
      }

      const port = address.port;
      probeServer.close(() => {
        resolve(port);
      });
    });
  });
}

function listenOnAvailablePort(server) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, LOCAL_HTTPS_HOSTNAME, () => {
      const address = server.address();

      if (!address || typeof address === "string") {
        reject(new Error("Could not allocate a local port."));
        return;
      }

      resolve(address.port);
    });
  });
}

function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function enforceNavigationPolicy(mainWindow, applicationUrl) {
  const trustedOrigin = applicationUrl.origin;

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    openExternalHttpsUrl(url);
    return { action: "deny" };
  });

  mainWindow.webContents.on("will-navigate", (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);

    if (parsedUrl.origin === trustedOrigin) {
      return;
    }

    event.preventDefault();
    openExternalHttpsUrl(navigationUrl);
  });
}

function openExternalHttpsUrl(url) {
  const parsedUrl = new URL(url);

  if (parsedUrl.protocol === HTTPS_PROTOCOL) {
    void shell.openExternal(parsedUrl.toString());
  }
}

function buildConfigurationErrorUrl(message) {
  const escapedMessage = escapeHtml(message);
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>World Cup Desk startup</title>
    <style>
      body {
        margin: 0;
        display: grid;
        min-height: 100vh;
        place-items: center;
        background: #f4f7f2;
        color: #141713;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      main {
        width: min(620px, calc(100vw - 32px));
        border: 1px solid #dfe6dc;
        border-radius: 8px;
        background: #ffffff;
        padding: 28px;
      }
      h1 {
        margin: 0 0 12px;
        font-size: 28px;
      }
      p {
        color: #667064;
        line-height: 1.55;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Secure startup failed</h1>
      <p>${escapedMessage}</p>
    </main>
  </body>
</html>`;

  return `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function isTrustedLocalCertificate(certificateUrl, certificate) {
  if (!trustedLocalHttpsOrigin || !trustedCertificateFingerprint) {
    return false;
  }

  const parsedUrl = new URL(certificateUrl);

  if (parsedUrl.origin !== trustedLocalHttpsOrigin || !LOCALHOST_NAMES.has(parsedUrl.hostname)) {
    return false;
  }

  const certificateFingerprint = certificate.data
    ? calculateCertificateFingerprint(certificate.data)
    : normalizeFingerprint(certificate.fingerprint ?? "");

  return normalizeFingerprint(certificateFingerprint) === normalizeFingerprint(trustedCertificateFingerprint);
}

function normalizeFingerprint(fingerprint) {
  return fingerprint.replace(/[^a-f0-9]/gi, "").toLowerCase();
}

function writeStartupLog(message) {
  try {
    const logPath = path.join(app.getPath("userData"), "startup.log");
    const logLine = `${new Date().toISOString()} ${message}\n`;
    fs.appendFileSync(logPath, logLine, "utf8");
  } catch {
  }
}

function stopApplicationRuntime() {
  if (httpsProxyServer) {
    httpsProxyServer.close();
    httpsProxyServer = null;
  }
}

app.on("certificate-error", (event, webContents, url, error, certificate, callback) => {
  event.preventDefault();
  callback(isTrustedLocalCertificate(url, certificate));
});

app.whenReady().then(() => {
  void createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      void createMainWindow();
    }
  });
});

app.on("before-quit", () => {
  stopApplicationRuntime();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
