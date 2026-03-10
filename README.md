# Operations Dashboard

## Run locally

```bash
npm install
npm run dev
```

## Docker (production)

Build image:

```bash
docker build \
  --build-arg VITE_AZURE_AD_CLIENT_ID=your-client-id \
  --build-arg VITE_AZURE_AD_TENANT_ID=your-tenant-id \
  --build-arg VITE_AZURE_AD_REDIRECT_URI=https://your-domain/landing \
  --build-arg VITE_AZURE_AD_API_SCOPE=User.Read \
  -t operations-dashboard:latest .
```

Run container:

```bash
docker run --rm -p 8080:80 operations-dashboard:latest
```

Export image:

```bash
docker save -o operations-dashboard_1.0.0.tar operations-dashboard:latest
gzip operations-dashboard_1.0.0.tar
```

Or retag first, then save

```bash
docker tag operations-dashboard:latest operations-dashboard:1.0.0
docker save -o operations-dashboard_1.0.0.tar operations-dashboard:1.0.0
gzip operations-dashboard_1.0.0.tar
```

Open app at `http://localhost:8080`.

Notes:

- Container serves static files with Nginx.
- SPA routes are supported via `try_files ... /index.html`.
- `/api/*` is proxied to the configured backend in `nginx.conf`.
