# Admin API Reference

Quick reference for accessing collected user data.

---

## Authentication

All admin endpoints require authentication using an API key.

**Header Required:**
```
x-admin-key: YOUR_ADMIN_API_KEY
```

The `ADMIN_API_KEY` is set in your `.env` file on the server.

---

## Base URL

**Development:** `http://localhost:5000/api/admin`
**Production:** `https://YOUR_DOMAIN.com/api/admin`

---

## Endpoints

### 1. Get All Email Captures

Retrieve all captured email addresses with test scores.

**Endpoint:** `GET /api/admin/email-captures`

**Example Request:**
```bash
curl -H "x-admin-key: YOUR_ADMIN_API_KEY" \
  https://YOUR_DOMAIN.com/api/admin/email-captures
```

**Response:**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "courseId": "javascript-basics",
      "courseName": "JavaScript Basics",
      "score": 8,
      "totalQuestions": 10,
      "percentage": 80,
      "capturedAt": "2025-11-04T12:34:56.789Z"
    }
  ],
  "count": 1
}
```

**Fields:**
- `id`: Unique identifier
- `email`: User's email address
- `courseId`: Course identifier
- `courseName`: Human-readable course name
- `score`: Number of correct answers
- `totalQuestions`: Total questions in the test
- `percentage`: Calculated percentage (0-100)
- `capturedAt`: Timestamp when captured

---

### 2. Get All Test Results

Retrieve all test results (may not include email).

**Endpoint:** `GET /api/admin/test-results`

**Example Request:**
```bash
curl -H "x-admin-key: YOUR_ADMIN_API_KEY" \
  https://YOUR_DOMAIN.com/api/admin/test-results
```

**Response:**
```json
{
  "data": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "courseId": "react-fundamentals",
      "score": 7,
      "totalQuestions": 10,
      "answers": "[{\"questionId\":\"q1\",\"selectedAnswer\":0,\"correct\":true}]",
      "completedAt": "2025-11-04T13:45:00.000Z",
      "shareId": "abc123xyz"
    }
  ],
  "count": 1
}
```

**Fields:**
- `id`: Unique identifier
- `courseId`: Course identifier
- `score`: Number of correct answers
- `totalQuestions`: Total questions
- `answers`: JSON string with detailed answers
- `completedAt`: When test was completed
- `shareId`: Shareable link ID (nullable)

---

### 3. Export Email Captures

Download email captures data as CSV or JSON.

**Endpoint:** `GET /api/admin/export/email-captures?format=csv|json`

**CSV Export:**
```bash
curl -H "x-admin-key: YOUR_ADMIN_API_KEY" \
  "https://YOUR_DOMAIN.com/api/admin/export/email-captures?format=csv" \
  -o email-captures.csv
```

**JSON Export:**
```bash
curl -H "x-admin-key: YOUR_ADMIN_API_KEY" \
  "https://YOUR_DOMAIN.com/api/admin/export/email-captures?format=json" \
  -o email-captures.json
```

**CSV Format:**
```csv
ID,Email,Course ID,Course Name,Score,Total Questions,Percentage,Captured At
550e8400-e29b-41d4-a716-446655440000,user@example.com,javascript-basics,JavaScript Basics,8,10,80,2025-11-04T12:34:56.789Z
```

---

### 4. Export Test Results

Download test results data as CSV or JSON.

**Endpoint:** `GET /api/admin/export/test-results?format=csv|json`

**CSV Export:**
```bash
curl -H "x-admin-key: YOUR_ADMIN_API_KEY" \
  "https://YOUR_DOMAIN.com/api/admin/export/test-results?format=csv" \
  -o test-results.csv
```

**JSON Export:**
```bash
curl -H "x-admin-key: YOUR_ADMIN_API_KEY" \
  "https://YOUR_DOMAIN.com/api/admin/export/test-results?format=json" \
  -o test-results.json
```

**CSV Format:**
```csv
ID,Course ID,Score,Total Questions,Completed At,Share ID
660e8400-e29b-41d4-a716-446655440001,react-fundamentals,7,10,2025-11-04T13:45:00.000Z,abc123xyz
```

---

## JavaScript Examples

### Fetch Email Captures

```javascript
const fetchEmailCaptures = async () => {
  const response = await fetch('https://YOUR_DOMAIN.com/api/admin/email-captures', {
    headers: {
      'x-admin-key': 'YOUR_ADMIN_API_KEY'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const { data, count } = await response.json();
  console.log(`Found ${count} email captures`);
  return data;
};

// Usage
fetchEmailCaptures()
  .then(captures => {
    captures.forEach(capture => {
      console.log(`${capture.email} scored ${capture.percentage}% on ${capture.courseName}`);
    });
  })
  .catch(error => console.error('Error:', error));
```

### Fetch Test Results

```javascript
const fetchTestResults = async () => {
  const response = await fetch('https://YOUR_DOMAIN.com/api/admin/test-results', {
    headers: {
      'x-admin-key': 'YOUR_ADMIN_API_KEY'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const { data, count } = await response.json();
  return data;
};
```

### Download CSV

```javascript
const downloadEmailCapturesCSV = async () => {
  const response = await fetch(
    'https://YOUR_DOMAIN.com/api/admin/export/email-captures?format=csv',
    {
      headers: {
        'x-admin-key': 'YOUR_ADMIN_API_KEY'
      }
    }
  );

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'email-captures.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};
```

---

## Python Examples

### Using requests library

```python
import requests

ADMIN_API_KEY = "YOUR_ADMIN_API_KEY"
BASE_URL = "https://YOUR_DOMAIN.com/api/admin"

headers = {
    "x-admin-key": ADMIN_API_KEY
}

# Get email captures
response = requests.get(f"{BASE_URL}/email-captures", headers=headers)
if response.status_code == 200:
    data = response.json()
    print(f"Found {data['count']} email captures")
    for capture in data['data']:
        print(f"{capture['email']} - {capture['percentage']}%")
else:
    print(f"Error: {response.status_code}")

# Download CSV
response = requests.get(
    f"{BASE_URL}/export/email-captures?format=csv",
    headers=headers
)
if response.status_code == 200:
    with open('email-captures.csv', 'wb') as f:
        f.write(response.content)
    print("CSV downloaded successfully")
```

---

## Error Responses

### 401 Unauthorized
Missing or invalid API key.

```json
{
  "error": "Unauthorized: Invalid admin key"
}
```

### 500 Internal Server Error
Server configuration issue.

```json
{
  "error": "Admin API key not configured"
}
```

### 404 Not Found
Endpoint doesn't exist.

```json
{
  "error": "Not found"
}
```

---

## Testing with Postman

1. Create a new request in Postman
2. Set method to `GET`
3. Enter URL: `https://YOUR_DOMAIN.com/api/admin/email-captures`
4. Go to **Headers** tab
5. Add header:
   - Key: `x-admin-key`
   - Value: `YOUR_ADMIN_API_KEY`
6. Click **Send**

---

## Testing with Browser

You can use browser developer tools:

```javascript
// Open browser console (F12) and paste:

fetch('https://YOUR_DOMAIN.com/api/admin/email-captures', {
  headers: {
    'x-admin-key': 'YOUR_ADMIN_API_KEY'
  }
})
.then(r => r.json())
.then(data => console.table(data.data));
```

---

## Rate Limiting

Currently, there are **no rate limits** on admin endpoints.

**Recommendations:**
- Don't share your API key publicly
- Implement your own rate limiting if needed
- Monitor server logs for suspicious activity

---

## Security Best Practices

1. **Keep API Key Secret**
   - Never commit to git
   - Don't share in public channels
   - Use environment variables

2. **HTTPS Only**
   - Always use HTTPS in production
   - API key is sent in headers (not encrypted without HTTPS)

3. **IP Whitelisting** (Optional)
   - Configure AWS Lightsail firewall
   - Allow only specific IPs to access your server

4. **Rotate Keys**
   - Change `ADMIN_API_KEY` periodically
   - Update `.env` file and restart app

---

## For Web Developers

To integrate admin dashboard into your frontend:

```typescript
// types.ts
interface EmailCapture {
  id: string;
  email: string;
  courseId: string;
  courseName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  capturedAt: string;
}

interface TestResult {
  id: string;
  courseId: string;
  score: number;
  totalQuestions: number;
  answers: string;
  completedAt: string;
  shareId: string | null;
}

// api.ts
const ADMIN_API_KEY = process.env.NEXT_PUBLIC_ADMIN_API_KEY; // Or however you store it
const API_BASE = 'https://YOUR_DOMAIN.com/api/admin';

export const adminAPI = {
  async getEmailCaptures(): Promise<EmailCapture[]> {
    const res = await fetch(`${API_BASE}/email-captures`, {
      headers: { 'x-admin-key': ADMIN_API_KEY! }
    });
    const { data } = await res.json();
    return data;
  },

  async getTestResults(): Promise<TestResult[]> {
    const res = await fetch(`${API_BASE}/test-results`, {
      headers: { 'x-admin-key': ADMIN_API_KEY! }
    });
    const { data } = await res.json();
    return data;
  },

  async exportEmailCapturesCSV(): Promise<Blob> {
    const res = await fetch(`${API_BASE}/export/email-captures?format=csv`, {
      headers: { 'x-admin-key': ADMIN_API_KEY! }
    });
    return res.blob();
  }
};
```

---

## Support

For issues or questions:
- Check server logs: `pm2 logs serrari-challenge`
- Verify API key in `.env` file
- Ensure HTTPS is configured
- Test with curl first before integrating
