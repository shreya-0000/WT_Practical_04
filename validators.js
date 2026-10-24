// validators.js - all server-side validation rules live here (a Node module)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[6-9]\d{9}$/; // Indian 10-digit mobile number
const NAME_RE = /^[A-Za-z][A-Za-z .'-]{1,49}$/;

function validateRegistration(data, existingUsers = []) {
  const errors = {};
  const clean = {
    name: String(data.name || '').trim(),
    email: String(data.email || '').trim().toLowerCase(),
    age: String(data.age || '').trim(),
    phone: String(data.phone || '').trim(),
    password: String(data.password || ''),
    confirmPassword: String(data.confirmPassword || ''),
  };

  // Name
  if (!clean.name) errors.name = 'Name is required.';
  else if (!NAME_RE.test(clean.name))
    errors.name = 'Name must be 2-50 characters and contain only letters, spaces, . \' or -.';

  // Email
  if (!clean.email) errors.email = 'Email is required.';
  else if (!EMAIL_RE.test(clean.email)) errors.email = 'Enter a valid email address.';
  else if (existingUsers.some((u) => u.email === clean.email))
    errors.email = 'This email is already registered.';

  // Age
  if (!clean.age) errors.age = 'Age is required.';
  else if (!/^\d+$/.test(clean.age)) errors.age = 'Age must be a whole number.';
  else if (Number(clean.age) < 18 || Number(clean.age) > 100)
    errors.age = 'Age must be between 18 and 100.';

  // Phone
  if (!clean.phone) errors.phone = 'Phone number is required.';
  else if (!PHONE_RE.test(clean.phone))
    errors.phone = 'Phone must be a 10-digit number starting with 6-9.';

  // Password
  if (!clean.password) errors.password = 'Password is required.';
  else if (clean.password.length < 8) errors.password = 'Password must be at least 8 characters.';
  else if (!/[A-Z]/.test(clean.password) || !/[a-z]/.test(clean.password) ||
           !/\d/.test(clean.password))
    errors.password = 'Password needs an uppercase letter, a lowercase letter and a digit.';

  // Confirm password
  if (!clean.confirmPassword) errors.confirmPassword = 'Please confirm your password.';
  else if (clean.password !== clean.confirmPassword)
    errors.confirmPassword = 'Passwords do not match.';

  return { valid: Object.keys(errors).length === 0, errors, clean };
}

module.exports = { validateRegistration };
