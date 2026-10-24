// views.js - HTML rendering helpers (a Node module)

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function layout(title, body) {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<style>
  body{font-family:system-ui,sans-serif;background:#f3f4f6;margin:0;padding:24px;color:#1f2937}
  .card{max-width:480px;margin:0 auto;background:#fff;padding:28px;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,.08)}
  h1{margin-top:0;font-size:1.5rem}
  label{display:block;margin-top:14px;font-weight:600;font-size:.9rem}
  input{width:100%;padding:10px;margin-top:4px;border:1px solid #d1d5db;border-radius:6px;box-sizing:border-box;font-size:1rem}
  input.bad{border-color:#dc2626;background:#fef2f2}
  .err{color:#dc2626;font-size:.85rem;margin-top:3px}
  .alert{padding:12px;border-radius:6px;margin-bottom:12px}
  .alert.error{background:#fef2f2;color:#991b1b;border:1px solid #fecaca}
  .alert.success{background:#ecfdf5;color:#065f46;border:1px solid #a7f3d0}
  button{margin-top:20px;width:100%;padding:12px;background:#2563eb;color:#fff;border:0;border-radius:6px;font-size:1rem;cursor:pointer}
  table{width:100%;border-collapse:collapse;margin-top:12px}
  td,th{padding:8px;border-bottom:1px solid #e5e7eb;text-align:left;font-size:.9rem}
  nav{max-width:480px;margin:0 auto 12px}
  a{color:#2563eb}
</style></head><body>
<nav><a href="/">Register</a> | <a href="/users">Registered users</a></nav>
<div class="card">${body}</div></body></html>`;
}

function field(name, label, type, values, errors) {
  const val = type === 'password' ? '' : esc(values[name] || '');
  const err = errors[name];
  return `<label for="${name}">${label}</label>
<input id="${name}" name="${name}" type="${type}" value="${val}" class="${err ? 'bad' : ''}">
${err ? `<div class="err">${esc(err)}</div>` : ''}`;
}

function formPage(values = {}, errors = {}) {
  const hasErrors = Object.keys(errors).length > 0;
  return layout('Registration', `
<h1>User Registration</h1>
${hasErrors ? '<div class="alert error">Please fix the errors below and submit again.</div>' : ''}
<form method="POST" action="/register" novalidate>
  ${field('name', 'Full name', 'text', values, errors)}
  ${field('email', 'Email', 'email', values, errors)}
  ${field('age', 'Age', 'text', values, errors)}
  ${field('phone', 'Phone (10 digits)', 'text', values, errors)}
  ${field('password', 'Password', 'password', values, errors)}
  ${field('confirmPassword', 'Confirm password', 'password', values, errors)}
  <button type="submit">Register</button>
</form>`);
}

function successPage(user) {
  return layout('Success', `
<h1>Registration successful</h1>
<div class="alert success">Welcome, ${esc(user.name)}! Your account has been created.</div>
<p>Email: ${esc(user.email)}<br>Age: ${esc(user.age)}<br>Phone: ${esc(user.phone)}</p>
<p><a href="/">Register another user</a></p>`);
}

function usersPage(users) {
  const rows = users.map((u) =>
    `<tr><td>${esc(u.name)}</td><td>${esc(u.email)}</td><td>${esc(u.age)}</td><td>${esc(u.phone)}</td></tr>`).join('');
  return layout('Users', `
<h1>Registered users (${users.length})</h1>
${users.length ? `<table><tr><th>Name</th><th>Email</th><th>Age</th><th>Phone</th></tr>${rows}</table>` : '<p>No users yet.</p>'}`);
}

function messagePage(status, title, message) {
  return layout(title, `<h1>${esc(title)}</h1><div class="alert error">${esc(message)}</div><a href="/">Back to form</a>`);
}

module.exports = { formPage, successPage, usersPage, messagePage };
