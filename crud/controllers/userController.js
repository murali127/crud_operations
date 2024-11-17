const User = require('../models/User'); // Ensure the path is correct

// Render signup page
exports.renderSignup = (req, res) => {
  res.render('signup', { error: null }); // Ensure 'signup.ejs' exists
};

// Render login page
exports.renderLogin = (req, res) => {
  res.render('login', { error: null }); // Ensure 'login.ejs' exists
};

// Handle user signup
exports.signup = async (req, res) => {
  try {
    const { name, email, phnum, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('signup', { error: 'Email already in use' });
    }

    const user = new User({ name, email, phnum, password });
    await user.save();
    res.redirect('/login');
  } catch (error) {
    console.error('Error during signup:', error);
    res.render('signup', { error: 'An error occurred during signup' });
  }
};

// Handle user login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && await user.comparePassword(password)) {
      req.session.userId = user._id;
      res.redirect('/books');
    } else {
      res.render('login', { error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.render('login', { error: 'An error occurred during login' });
  }
};

// Handle user logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error during logout:', err);
      return res.status(500).send('Server error');
    }
    res.redirect('/login');
  });
};