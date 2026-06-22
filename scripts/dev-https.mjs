import { spawn } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import https from "node:https";
import path from "node:path";
import { setTimeout as wait } from "node:timers/promises";
import selfsigned from "selfsigned";

const internalApplicationUrl = new URL("http://127.0.0.1:15174");
const httpsHostname = "127.0.0.1";
const httpsPort = 15173;
const certificateDirectoryPath = path.join(process.cwd(), ".dev-certs");
const certificatePath = path.join(certificateDirectoryPath, "localhost.crt");
const privateKeyPath = path.join(certificateDirectoryPath, "localhost.key");
const devCommand = process.platform === "win32" ? "cmd.exe" : "npm";
const devArguments = process.platform === "win32" ? ["/d", "/s", "/c", "npm run dev"] : ["run", "dev"];

const webProcess = spawn(devCommand, devArguments, {
  cwd: process.cwd(),
  shell: false,
  stdio: ["ignore", "pipe", "pipe"]
});

webProcess.stdout.on("data", (chunk) => {
  process.stdout.write(chunk);
});

webProcess.stderr.on("data", (chunk) => {
  process.stderr.write(chunk);
});

await waitForApplication(internalApplicationUrl);

const certificateMaterial = await ensureCertificateMaterial();

const httpsProxyServer = https.createServer(
  {
    cert: certificateMaterial.certificate,
    key: certificateMaterial.privateKey
  },
  (clientRequest, clientResponse) => {
    proxyRequest(clientRequest, clientResponse);
  }
);

httpsProxyServer.listen(httpsPort, httpsHostname, () => {
  console.log(`Secure local site: https://${httpsHostname}:${httpsPort}`);
});

process.on("SIGINT", stopDevelopmentServers);
process.on("SIGTERM", stopDevelopmentServers);

function proxyRequest(clientRequest, clientResponse) {
  const upstreamRequest = http.request(
    {
      hostname: internalApplicationUrl.hostname,
      method: clientRequest.method,
      path: clientRequest.url,
      port: internalApplicationUrl.port,
      protocol: internalApplicationUrl.protocol,
      headers: {
        ...clientRequest.headers,
        host: internalApplicationUrl.host,
        "x-forwarded-host": clientRequest.headers.host ?? internalApplicationUrl.host,
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

    clientResponse.end("World Cup Desk development server is unavailable.");
  });

  clientRequest.pipe(upstreamRequest);
}

async function ensureCertificateMaterial() {
  if (fs.existsSync(certificatePath) && fs.existsSync(privateKeyPath)) {
    return {
      certificate: fs.readFileSync(certificatePath, "utf8"),
      privateKey: fs.readFileSync(privateKeyPath, "utf8")
    };
  }

  fs.mkdirSync(certificateDirectoryPath, { recursive: true });

  const certificateBundle = await selfsigned.generate([{ name: "commonName", value: "localhost" }], {
    algorithm: "sha256",
    keySize: 2048,
    days: 3650,
    extensions: [
      { name: "basicConstraints", cA: true, critical: true },
      { name: "keyUsage", keyCertSign: true, digitalSignature: true, keyEncipherment: true, critical: true },
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
  });

  fs.writeFileSync(certificatePath, certificateBundle.cert, { encoding: "utf8", mode: 0o600 });
  fs.writeFileSync(privateKeyPath, certificateBundle.private, { encoding: "utf8", mode: 0o600 });
  console.log(`Created local HTTPS certificate: ${certificatePath}`);
  console.log("Trust it once with: npm run dev:https:trust");

  return {
    certificate: certificateBundle.cert,
    privateKey: certificateBundle.private
  };
}

async function waitForApplication(applicationUrl) {
  const maximumAttempts = 80;

  for (let attempt = 1; attempt <= maximumAttempts; attempt += 1) {
    try {
      const response = await fetch(applicationUrl);

      if (response.ok) {
        return;
      }
    } catch {
      await wait(500);
    }
  }

  webProcess.kill();
  throw new Error(`Application did not become ready at ${applicationUrl.toString()}.`);
}

function stopDevelopmentServers() {
  httpsProxyServer.close();
  webProcess.kill();
  process.exit(0);
}
