This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Information

This application uses Next.JS with AuthJS & Typescript. After authentication & authorization with Strava all strava activities are rendered and can be analyzed using the OpenAI API.

## Getting Started

### Set up Strava

First, create a new API application in Strava and copy the STRAVA_ID, STRAVA_SECRET, AUTH_SECRET and the STRAVA_REDIRECT_URI in your .env.local file (see [.env.example](.env.example))

### Set up Google Static Maps

[Google Maps Static API Docs](https://developers.google.com/maps/documentation/maps-static/start)

Copy your Google Satic Maps API key into your .env.local file

### Start the dev server

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/analysis.tsx`.
