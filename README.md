# World Cup Desk

Production-shaped World Cup news and report desk.

## What it is

- Next.js web service with live World Cup news and FIFA Training Centre PDF reports.
- One-program Windows desktop app powered by Electron.
- The packaged Windows app starts the bundled Next.js server itself.
- The desktop UI loads through an app-owned HTTPS loopback proxy with certificate pinning.
- HTTPS-only production configuration for remote feed sources.
- Standalone Docker build for scalable server deployment.
- Nginx HTTPS reverse-proxy example.

## Local web development

```powershell
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:15174
```

## Local Windows desktop development

```powershell
npm run dev:desktop
```

This starts the local Next.js server and opens the secure Electron shell through its local HTTPS proxy.

## Production web service

Build the standalone Next.js server:

```powershell
npm run build
npm run start
```

Production start listens on `0.0.0.0:3000`. Put it behind HTTPS using `deploy/nginx.conf` or an equivalent TLS proxy.

## Docker

```powershell
docker build -t world-cup-desk .
docker run --rm -p 3000:3000 --env-file .env world-cup-desk
```

Terminate TLS before the container. The container serves HTTP internally; public traffic should arrive through HTTPS.

## Windows build

```powershell
npm run dist:win
```

The installer is written to:

```text
release/
```

The packaged Windows app is self-contained: it includes the Next.js standalone server, starts it on a random loopback port, starts a local HTTPS proxy, pins the generated certificate in Electron, and opens the UI at `https://127.0.0.1:<random-port>/`.

## Environment

Copy `.env.example` to `.env` for server deployment values. All remote feed URLs must use HTTPS.
