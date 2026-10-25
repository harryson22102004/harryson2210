# GoMechanic Bhubaneswar — Full-Stack Practice Recreation

A responsive React/Vite recreation inspired by the public GoMechanic Bhubaneswar service page, plus a small Node.js HTTP backend for demo estimates and booking requests. This is an independent learning project, not affiliated with GoMechanic.

## Requirements

- Node.js 18 or newer
- npm

## Run frontend and backend together

```bash
npm install
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3001/api/health
- Vite proxies `/api/*` requests to the Express API during local development.

## Build and run as one app

```bash
npm run build
npm start
```

The server serves `dist/` and the API from the same origin on port 3001. Set `PORT` to change the server port.

## API endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/services` | Service catalogue with indicative demo ranges |
| GET | `/api/cars` | Supported brands, models and fuel types |
| POST | `/api/quote` | Generate a demo estimate based on selected car/service |
| POST | `/api/bookings` | Validate and persist a demo booking request |

Example quote body:

```json
{
  "car": { "make": "Tata", "model": "Nexon", "fuel": "Petrol" },
  "serviceName": "Standard Service",
  "city": "Bhubaneswar"
}
```

Booking requests are stored in `backend/data/bookings.json`, which is generated locally when the API starts. The file is git-ignored to prevent personal contact/address details from being committed.

## Important limitations

- All prices are illustrative demo estimates, not official GoMechanic prices.
- Booking requests are stored locally for demonstration only. They are not sent to GoMechanic and do not create real appointments.
- No real login, payment, SMS, email or third-party booking integration is configured.
- Placeholder reviews are labelled as demo content and are not genuine customer testimonials.
- Use official brand assets and third-party integrations only when authorised.

## Quality checks

```bash
npm run build
```