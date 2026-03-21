# API Configuration Guide

This guide explains how to configure the backend API for the Code Deterministic AI platform.

## Environment Variables

### `NEXT_PUBLIC_API_URL`
The base URL for your backend API.

**Default Value:** `/api` (uses local Next.js API routes)

**Possible Values:**
- `/api` - Use local Next.js API routes (included in this project)
- `http://localhost:5000/api` - Local Express backend on port 5000
- `http://localhost:3001/api` - Local Express backend on port 3001
- `https://api.yourdomain.com` - Production backend URL

**Example Setup:**

**Development (Local Mock API):**
```bash
NEXT_PUBLIC_API_URL=/api
```

**Development (Local Express Backend):**
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Production:**
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### `NEXT_PUBLIC_API_TIMEOUT` (Optional)
Request timeout in milliseconds.

**Default Value:** `30000` (30 seconds)

**Example:**
```bash
NEXT_PUBLIC_API_TIMEOUT=60000
```

## Setting Environment Variables

### Local Development

1. Copy the example file:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` with your configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_API_TIMEOUT=30000
```

3. The dev server will automatically pick up these values.

### Vercel Deployment

1. Go to your Vercel project settings
2. Navigate to **Settings** → **Environment Variables**
3. Add the variables:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://api.yourdomain.com` (or your actual backend URL)
4. Click **Save**
5. Redeploy your project

**Note:** `NEXT_PUBLIC_*` variables are exposed to the browser, so they're safe for use without secrets.

## API Endpoints

When using the mock API (`/api`), the following endpoints are available:

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### Code Review
- `POST /api/review` - Analyze code for issues
- `GET /api/review` - Get review history

### AI Suggestions
- `POST /api/suggest` - Generate suggestions (optimize/tests/complexity)

## Switching Between Local and Remote Backend

### To use local mock API:
```env
NEXT_PUBLIC_API_URL=/api
```

### To use local Express backend:
1. Start your Express server on port 5000
2. Set:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### To use remote backend:
1. Update in `.env.local` or Vercel settings:
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

## Troubleshooting

### CORS Errors
If you see CORS errors when calling a remote backend:
- Ensure your backend allows requests from your frontend origin
- The backend should have CORS configured:
```javascript
app.use(cors({
  origin: 'http://localhost:3000', // for local dev
  credentials: true
}))
```

### 404 Errors
- Verify the `NEXT_PUBLIC_API_URL` is correct
- Check that your backend is running and accessible
- Verify the API endpoint paths match your backend routes

### Timeout Errors
- Increase `NEXT_PUBLIC_API_TIMEOUT` if your API is slow
- Default is 30 seconds, which should be sufficient for most operations

## API Configuration in Code

The API configuration is set in `/lib/api.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000', 10)

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
})
```

This axios instance is used throughout the application for all API requests.
