const express = require('express');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'HASH LOGIN',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60,
    sameSite: 'lax'
  }
}));

const USERS_FILE = path.join(__dirname, 'users.json');

function readUsersFromFile() {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE, 'utf-8');
  return data ? JSON.parse(data) : [];
}

function writeUsersToFile(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function validatePassword(password) {
  const errors = [];
  if (password.length < 8) errors.push('At least 8 characters required.');
  if (!/[A-Z]/.test(password)) errors.push('Must contain at least one uppercase letter.');
  if (!/\d/.test(password)) errors.push('Must contain at least one number.');
  if (!/[!@#$%^&*(),.?":{}|<>_\-]/.test(password)) errors.push('Must contain at least one symbol.');
  return errors;
}

function requireLogin(req, res, next) {
  if (!req.session.userId) return res.redirect('/login');
  next();
}

function redirectIfLoggedIn(req, res, next) {
  if (req.session.userId) return res.redirect('/dashboard');
  next();
}

app.get('/', (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.redirect('/login');
});

app.get('/register', redirectIfLoggedIn, (req, res) => {
  res.render('register', { errors: [], email: '' });
});

app.post('/register', redirectIfLoggedIn, async (req, res) => {
  const { email, password } = req.body;
  
  const errors = validatePassword(password);
  if (errors.length > 0) return res.render('register', { errors, email });

  const users = readUsersFromFile();
  if (users.find(u => u.email === email)) {
    return res.render('register', { errors: ['Email already in use.'], email });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ email, password: hashedPassword });
  writeUsersToFile(users);

  req.session.userId = email;
  res.redirect('/dashboard');
});

app.get('/login', redirectIfLoggedIn, (req, res) => {
  res.render('login', { errors: [] });
});

app.post('/login', redirectIfLoggedIn, async (req, res) => {
  const { email, password } = req.body;
  const users = readUsersFromFile();
  const user = users.find(u => u.email === email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.render('login', { errors: ['Invalid email or password.'] });
  }

  req.session.userId = email;
  res.redirect('/dashboard');
});

app.get('/dashboard', requireLogin, (req, res) => {
  res.render('dashboard', { userId: req.session.userId });
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) console.error('Session destroy error:', err);
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

