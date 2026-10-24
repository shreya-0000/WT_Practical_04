// routes.js - routing + request/response handling (a Node module)
const querystring = require('querystring');
const { validateRegistration } = require('./validators');
const views = require('./views');

const users = []; // in-memory store (resets when server restarts)
const MAX_BODY = 10 * 1024; // 10 KB limit

function send(res, status, html) {
  res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > MAX_BODY) {
        reject(new Error('PAYLOAD_TOO_LARGE'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

async function handleRequest(req, res) {
  const { pathname } = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const method = req.method;

  // GET / -> show empty form
  if (pathname === '/' && method === 'GET') return send(res, 200, views.formPage());

  // GET /users -> list registered users
  if (pathname === '/users' && method === 'GET') return send(res, 200, views.usersPage(users));

  // POST /register -> validate on the server
  if (pathname === '/register' && method === 'POST') {
    let raw;
    try {
      raw = await readBody(req);
    } catch (e) {
      return send(res, 413, views.messagePage(413, 'Request too large', 'The submitted data was too large.'));
    }
    const data = querystring.parse(raw);
    const { valid, errors, clean } = validateRegistration(data, users);

    if (!valid) return send(res, 400, views.formPage(clean, errors)); // error messages

    const user = { name: clean.name, email: clean.email, age: clean.age, phone: clean.phone };
    users.push(user); // (password is validated but intentionally never stored/displayed in this demo)
    return send(res, 201, views.successPage(user)); // success message
  }

  // Known path, wrong method
  if (pathname === '/register' || pathname === '/' || pathname === '/users') {
    res.setHeader('Allow', pathname === '/register' ? 'POST' : 'GET');
    return send(res, 405, views.messagePage(405, 'Method not allowed', `${method} is not allowed on ${pathname}.`));
  }

  // Unknown path
  return send(res, 404, views.messagePage(404, 'Page not found', `No page exists at ${pathname}.`));
}

module.exports = { handleRequest, users };
