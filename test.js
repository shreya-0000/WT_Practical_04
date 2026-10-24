// test.js - tests the running server with valid and invalid inputs
const http = require('http');
const server = require('./server');

function request(port, method, path, form) {
  return new Promise((resolve, reject) => {
    const body = form ? new URLSearchParams(form).toString() : '';
    const req = http.request({ port, method, path, headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(body) } }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.end(body);
  });
}

const good = { name: 'Asha Patil', email: 'asha@example.com', age: '21',
  phone: '9876543210', password: 'Secret123', confirmPassword: 'Secret123' };

const cases = [
  ['GET / shows form',               'GET',  '/',         null, 200, 'User Registration'],
  ['Valid registration',             'POST', '/register', good, 201, 'Registration successful'],
  ['Duplicate email rejected',       'POST', '/register', good, 400, 'already registered'],
  ['Empty form',                     'POST', '/register', {}, 400, 'Name is required'],
  ['Invalid name (digits)',          'POST', '/register', { ...good, email: 'a1@x.com', name: 'R2D2' }, 400, 'Name must be'],
  ['Invalid email',                  'POST', '/register', { ...good, email: 'not-an-email' }, 400, 'valid email'],
  ['Age below 18',                   'POST', '/register', { ...good, email: 'b@x.com', age: '15' }, 400, 'between 18 and 100'],
  ['Age not a number',               'POST', '/register', { ...good, email: 'c@x.com', age: 'abc' }, 400, 'whole number'],
  ['Invalid phone',                  'POST', '/register', { ...good, email: 'd@x.com', phone: '12345' }, 400, '10-digit'],
  ['Weak password',                  'POST', '/register', { ...good, email: 'e@x.com', password: 'abc', confirmPassword: 'abc' }, 400, 'at least 8'],
  ['Password mismatch',              'POST', '/register', { ...good, email: 'f@x.com', confirmPassword: 'Different1' }, 400, 'do not match'],
  ['XSS input is escaped',           'POST', '/register', { ...good, email: 'g@x.com', name: '<script>alert(1)</script>' }, 400, '&lt;script&gt;'],
  ['GET /users lists user',          'GET',  '/users',    null, 200, 'asha@example.com'],
  ['GET on /register -> 405',        'GET',  '/register', null, 405, 'Method not allowed'],
  ['Unknown route -> 404',           'GET',  '/nope',     null, 404, 'Page not found'],
];

server.listen(0, async () => {
  const port = server.address().port;
  let failed = 0;
  for (const [name, m, p, f, status, text] of cases) {
    const r = await request(port, m, p, f);
    const ok = r.status === status && r.body.includes(text);
    if (!ok) failed++;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}  (HTTP ${r.status})`);
  }
  console.log(`\n${cases.length - failed}/${cases.length} tests passed`);
  server.close();
  process.exit(failed ? 1 : 0);
});
