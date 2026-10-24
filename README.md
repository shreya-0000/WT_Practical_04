# Practical 04 – Server-Side Validation with Node.js

A registration web app built with plain Node.js (no external packages). All validation happens on the **server**, so it cannot be bypassed by disabling browser checks.

## Run locally
```
node server.js        # or: npm start
```
Open http://localhost:3000

## Run tests
```
npm test
```

## Structure
| File | Purpose |
|---|---|
| `server.js` | Creates the HTTP server (entry point) |
| `routes.js` | Routing, GET/POST handling, body parsing, status codes |
| `validators.js` | Validation rules for each field |
| `views.js` | HTML pages with success/error messages (output is HTML-escaped) |
| `test.js` | 15 tests with valid and invalid inputs |

## Routes
| Method | Path | Result |
|---|---|---|
| GET | `/` | Registration form |
| POST | `/register` | 201 success page, or 400 form with error messages |
| GET | `/users` | List of registered users |
| other | any | 405 Method Not Allowed / 404 Not Found |

## Validation rules
- Name: 2-50 chars, letters/spaces/. ' - only
- Email: valid format, not already registered
- Age: whole number 18-100
- Phone: 10 digits starting with 6-9
- Password: 8+ chars with upper, lower and digit; must match confirmation

## Deploy (Render)
1. Push this folder to a GitHub repo.
2. On render.com: New > Web Service > select the repo.
3. Build command: *(leave empty)*  Start command: `node server.js`
4. The app reads the `PORT` environment variable automatically.
