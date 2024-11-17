const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// EJS Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files
app.use(helmet()); // Security middleware
app.use(morgan('dev')); // Logging middleware

// Session Setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
  }),
}));

// Routes
app.get('/', (req, res) => {
  res.render('home'); // Home page
});

app.get('/login', (req, res) => {
  res.render('login'); // Login page
});

// 404 Error Handling
app.use((req, res, next) => {
  res.status(404).send('Page Not Found');
});

// General Error Handling
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).send('Server Error');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server started on port ${PORT}`);
  try {
    const open = (await import('open')).default;
    await open(`http://localhost:${PORT}`);
  } catch (error) {
    console.error('Error opening the browser:', error);
  }
});
