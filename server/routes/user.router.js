// Required dependencies for user management
// express: Web framework for handling routes
// encryptLib: Custom module for password encryption
// pool: Database connection pool for PostgreSQL
// userStrategy: Passport strategy for local authentication
const express = require('express');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

// User Router
// Purpose: Handles all user-related operations including:
// - Authentication (login/logout)
// - Registration
// - User information retrieval
// - Admin-specific user operations


const router = express.Router();

// GET /api/user
// Purpose: Check authentication status and get user info
// Access: Public
// Response: 
// - Authenticated: Returns user object with id, username, is_admin
// - Unauthenticated: Returns empty object
// Used by: Frontend to maintain session state and show appropriate content
router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(req.user);
  } else {
    res.send({});
  }
});

// Import admin middleware for protected routes
const { rejectNonAdmin } = require('../modules/admin-middleware');

// GET /api/user/all
// Purpose: Retrieve list of all users
// Access: Admin only (enforced by rejectNonAdmin middleware)
// Response: Array of user objects
// Used by: Admin dashboard for user management
router.get('/all', rejectNonAdmin, (req, res) => {
  console.log ("WTF");
  // Get all of the users from the database
  const sqlText = `SELECT * FROM "user"`;
  pool.query(sqlText)
      .then((result) => {
        //console.log(result.rows);
          res.send(result.rows);
      })
      .catch((error) => {
          console.log(`Error making database query ${sqlText}`, error);
          res.sendStatus(500);
      });
});

// POST /api/user/register
// Purpose: Create new user account
// Access: Public
// Request body: 
// - username: string
// - password: string (will be hashed)
// Process:
// 1. Encrypts password using bcrypt
// 2. Stores new user in database with is_admin set to false
// 3. Returns 201 on success
router.post('/register', (req, res, next) => {
  const username = req.body.username;
  const hashedPassword = encryptLib.encryptPassword(req.body.password);

  const sqlText = `
    INSERT INTO "user"
      ("username", "password", "is_admin")
      VALUES
      ($1, $2, FALSE);
  `;
  const sqlValues = [username, hashedPassword];

  pool.query(sqlText, sqlValues)
    .then(() => {
      res.sendStatus(201)
    })
    .catch((dbErr) => {
      console.log('POST /api/user/register error: ', dbErr);
      res.sendStatus(500);
    });
});





// POST /api/user/login
// Purpose: Authenticate user and create session
// Access: Public
// Request body:
// - username: string
// - password: string
// Process:
// 1. Uses Passport local strategy for authentication
// 2. Verifies credentials against database
// 3. Creates session on success
// 4. Returns 200 if authenticated
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// POST /api/user/logout
// Purpose: End user session
// Access: Any authenticated user
// Process:
// 1. Uses Passport's logout method
// 2. Destroys session data
// 3. Returns 200 on successful logout
router.post('/logout', (req, res, next) => {
  // Use passport's built-in method to log out the user.
  req.logout((err) => {
    if (err) { 
      return next(err); 
    }
    res.sendStatus(200);
  });
});


module.exports = router;
