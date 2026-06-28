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
npm run dev:https
```

If the browser has not trusted the local development certificate yet, run once:

```powershell
npm run dev:https:trust
```

Open:

```text
https://127.0.0.1:15173
```

The HTTPS development proxy forwards to the internal Next.js server on `127.0.0.1:15174`.

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

Set the public canonical URL before deploying:

```powershell
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

This value is used for Open Graph metadata, `robots.txt`, `sitemap.xml`, and the PWA manifest.

## Vercel public deployment

The repository includes `vercel.json` for a public Next.js deployment.

1. Import `kazimlik81-lab/World-Cup-Desk` into Vercel.
2. Set `NEXT_PUBLIC_SITE_URL` to the production domain.
3. Keep the RSS environment values from `.env.example`, or override them with HTTPS-only feed URLs.
4. Deploy the `main` branch.
5. Submit `https://your-domain.example/sitemap.xml` to Google Search Console and Bing Webmaster Tools after DNS is live.

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

## Android app

The `android/` folder contains a native Android WebView shell for the public website.

```powershell
npm run android:debug -- -SiteUrl https://your-domain.example
npm run android:bundle -- -SiteUrl https://your-domain.example
```

The debug APK is written to `android/app/build/outputs/apk/debug/`. The Play Store bundle is written to `android/app/build/outputs/bundle/release/`.

Android builds require Android Studio or command-line Android SDK tooling with JDK 17 and Gradle 9.4.1. Public release URLs must use HTTPS.

## Environment

Copy `.env.example` to `.env` for server deployment values. All remote feed URLs must use HTTPS.
