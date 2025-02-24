// Required dependencies for design management
// multer: Middleware for handling multipart/form-data (file uploads)
// express.Router: For creating modular route handlers
// pool: Database connection for PostgreSQL
const multer = require('multer');
const router = require('express').Router();
const pool = require('../modules/pool');

// Design Router
// Purpose: Handles all design-related operations including:
// - Creating new designs with image uploads
// - Retrieving designs (all or user-specific)
// - Updating design information
// - Deleting designs (admin only)
// - Managing design permissions

// Multer Configuration
// Purpose: Configure file upload storage
// - Specifies where uploaded files are stored
// - Defines how filenames are generated
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, './public/images');
  },
  filename: (req, file, cb) => {
      cb(null, file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine });
//**for image upload */END

//have the authentication part of the get route (brad thinks he needs this so that this route is 
//"protected"... but Brad is not 100% certain about it)
//ON FRIDAY FEB 21 - CARLOS SEZ - THIS STATEMENT BELOW ONLY PASSES BACK THE WHOLE USER, NOT ALL USERS...
//USERS SHOULD NOT BE MANAGED ON THIS MODULE... BUT WE AIN'T FUCKING WITH IT.
// GET /api/design
// Purpose: Basic authentication check
// Access: Public
// Response:
// - Authenticated: Returns user object
// - Unauthenticated: Returns empty object
// Note: This route might be redundant as noted in comments
router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
      res.send(req.user);
    } else {
      res.send({});
    }
  });

  //Get request for DesignList - Feb18 in the morning
        //Brad wonders if this get request needs an userStrategy.authenticate('local')
        //after the '/all'.
const { rejectNonAdmin } = require('../modules/admin-middleware');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

// GET /api/design/all
// Purpose: Retrieve all designs in the system
// Access: Admin only (protected by rejectNonAdmin middleware)
// Response: Array of all design objects
// Used by: Admin dashboard for design management
router.get('/all', rejectUnauthenticated, rejectNonAdmin, (req, res) => {
    console.log ("Designs route WTF");
    // Get all of the users from the database
    const queryText = `SELECT * FROM "designs";`;
    pool.query(queryText)
      .then((result) => {
        console.log(result.rows);
        res.send(result.rows);
      })
      .catch((error) => {
        console.log(`Error getting all designs ${queryText}`, error);
        res.sendStatus(500);
      });
  });

// GET /api/design/user/:id
// Purpose: Get all designs for a specific user
// Access: Authenticated users (own designs) or admin
// Parameters: id - User ID whose designs to retrieve
// Security: Users can only view their own designs unless admin
// Response: Array of design objects belonging to specified user
router.get('/user/:id', rejectUnauthenticated, (req, res) => {
    console.log("Hit on route for designs for one user.");
    const { id } = req.params;

    // Only allow users to view their own designs unless they're admin
    if (req.user.access_level !== 'admin' && req.user.id !== Number(id)) {
      return res.sendStatus(403);
    }

    const queryText = `SELECT * FROM "designs" WHERE "belongs_to_user" = $1;`;
    const values = [id];

    pool.query(queryText, values)
      .then((result) => {
        res.send(result.rows);
        console.log("Hit on the query in the route for a single users designs.", result.rows);
      })
      .catch((error) => {
        console.log('Error GET /api/design/id', error);
        res.sendStatus(500);
      });
  });
  
// GET /api/design/:id
// Purpose: Retrieve a single design by ID
// Access: Authenticated users (own design) or admin
// Parameters: id - Design ID to retrieve
// Security: 
// - Validates design ownership
// - Checks admin privileges
// - Returns 404 if not found
router.get('/:id([0-9]+)', rejectUnauthenticated, async (req, res) => {
    const { id } = req.params;

    try {
      const queryText = `SELECT * FROM "designs" WHERE "id" = $1;`;
      const result = await pool.query(queryText, [id]);
      
      if (result.rows.length === 0) {
        return res.sendStatus(404);
      }

      const design = result.rows[0];
      // Check if user owns the design or is admin
      if (req.user.access_level !== 'admin' && design.belongs_to_user !== req.user.id) {
        return res.sendStatus(403);
      }

      res.send(design);
    }
    catch (error) {
      console.log('Error GET /api/design/:id', error);
      res.sendStatus(500);
    }
  });

// PUT /api/design/:id
// Purpose: Update design information
// Access: Authenticated users (own design) or admin
// Parameters:
// - id: Design ID to update
// - name: New design name
// Security:
// - Validates design ownership
// - Checks admin privileges
// - Returns 404 if not found
router.put('/:id([0-9]+)', rejectUnauthenticated, async (req, res) => {
    console.log("before Put req.body =", req.body);
    console.log("before Put req.params =", req.params);
    const { name } = req.body;
    const { id } = req.params;

    try {
      // Check if user owns the design or is admin
      const checkQuery = `SELECT belongs_to_user FROM "designs" WHERE "id" = $1;`;
      const result = await pool.query(checkQuery, [id]);
      
      if (result.rows.length === 0) {
        return res.sendStatus(404);
      }
      
      const design = result.rows[0];
      if (req.user.access_level !== 'admin' && design.belongs_to_user !== req.user.id) {
        return res.sendStatus(403);
      }

      // Update the design name
      const queryText = `UPDATE "designs" SET "name" = $1 WHERE "id" = $2 RETURNING *;`;
      const values = [name, id];
      const updateResult = await pool.query(queryText, values);
      res.send(updateResult.rows[0]);
    } catch (error) {
      console.log('Error PUT /api/design/id', error);
      res.sendStatus(500);
    }
  });
// DELETE /api/design/:id
// Purpose: Remove a design from the system
// Access: Admin only (protected by rejectNonAdmin)
// Parameters: id - Design ID to delete
// Security:
// - Requires admin privileges
// - Completely removes design from database
router.delete('/:id([0-9]+)', rejectUnauthenticated, rejectNonAdmin, (req,res) => {
    console.log("before Put req.body =",req.body);
    console.log("before Put req.params =",req.params);
    const {name} = req.body;
    const {id} = req.params;
    const queryText = `DELETE FROM "designs" WHERE "id"=$1`;
    const values = [id];

    pool
      .query(queryText, values)
      .then((result) =>{
        res.send(result.rows[0]);
      })
      .catch((error) =>{
        console.log('Error DELETE /api/design/id',error);
        res.sendStatus(500);
      });
  });


  //in the post route below you will see in the values line the entry 'req.body.userID' you would expect req.body.user.id - for some reason
  //a reason we do not know - VScode didn't like req.body.user.id - so we had to define 'userID = user.id' to keep an error from happening
  //<shoulder shrug emoji>
// POST /api/design
// Purpose: Create a new design with image upload
// Access: Authenticated users
// Request:
// - Multipart form data with image file
// - Design details (name, dimensions)
// Features:
// - Handles file upload using multer
// - Supports admin creating designs for other users
// - Maintains creator and owner information
router.post('/', rejectUnauthenticated, upload.single("image_file_name"), (req,res) => {
    let newDesign = req.body;
    console.log('in post design.router, this is req.body',req.body);
    console.log("image file.path is",req.file.path);
    
    // If admin is creating design for another user, use selectedUserId for belongs_to_user
    const belongsToUser = req.user.access_level === 'admin' && req.body.selectedUserId 
      ? req.body.selectedUserId 
      : req.body.userId;

    const queryString = 'INSERT INTO designs (name,height_in_inches,width_in_inches,image_file_name,design_created_by,belongs_to_user) VALUES($1,$2,$3,$4,$5,$6);'
    values = [
      req.body.name,
      req.body.height_in_inches,
      req.body.width_in_inches,
      req.file.path,
      req.body.userId, // creator is always current user
      belongsToUser    // owner can be different if admin is creating
    ];
    
  pool.query(queryString, values ).then((results)=>{
    res.sendStatus(201);
  }).catch((err)=>{
    console.log(err);
    res.sendStatus(400);
  })
  });
  //end of the get for DesignList

  module.exports = router;
