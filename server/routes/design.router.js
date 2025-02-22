// these are the imports Brad thought were necessary
const router = require('express').Router();
const pool = require('../modules/pool');


//have the authentication part of the get route (brad thinks he needs this so that this route is 
//"protected"... but Brad is not 100% certain about it)
//ON FRIDAY FEB 21 - CARLOS SEZ - THIS STATEMENT BELOW ONLY PASSES BACK THE WHOLE USER, NOT ALL USERS...
//USERS SHOULD NOT BE MANAGED ON THIS MODULE... BUT WE AIN'T FUCKING WITH IT.
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
// THIS IS THE GET ROUTE FOR ALL DESIGNS - ONLY USED BY ADMIN
router.get('/all', (req, res) => {
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

  //THIS IS THE GET ROUTE FOR ALL DESIGNS FOR A SINGLE USER - "USER VIEW OF DESIGNS NOT ADMIN VIEW"

  router.get('/:id', (req,res) => {
    console.log("Hit on route for designs for one user.");
    const {id} = req.params;
    const queryText = `SELECT * FROM "designs" WHERE "belongs_to_user" = $1;`;
    const values = [id];

    pool
      .query(queryText, values)
      .then((result) =>{
        res.send(result.rows);
        console.log("Hit on the query in the route for a single users designs.",result.rows);
      })
      .catch((error) =>{
        console.log('Error GET /api/design/id',error);
        res.sendStatus(500);
      });
      
  });
  
  //THIS IS THE EDIT ROUTE FOR A SINGLE DESIGN
  router.put('/:id', (req,res) => {
    console.log("before Put req.body =",req.body);
    console.log("before Put req.params =",req.params);
    const {name} = req.body;
    const {id} = req.params;
    const queryText = `UPDATE "designs" SET "name" = $1 WHERE "id"=$2;`;
    const values = [name,id];

    pool
      .query(queryText, values)
      .then((result) =>{
        res.send(result.rows[0]);
      })
      .catch((error) =>{
        console.log('Error PUT /api/design/id',error);
        res.sendStatus(500);
      });
  });
  //THIS IS THE DELETE ROUTE FOR A SINGLE DESIGN
  router.delete('/:id', (req,res) => {
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
  router.post('/',( req,res) => {
    let newDesign = req.body;
    console.log('in post design.router, this is req.body',req.body);
    const queryString = 'INSERT INTO designs (name,height_in_inches,width_in_inches,image_file_name,design_created_by,belongs_to_user) VALUES($1,$2,$3,$4,$5,$6);'
// in the values below I used req.body.userId for both design_created_by AND belongs_to_user
//because I don't have the 'drop down' for the user the design ties to implemented yet
//when I do, this will change and 'design belongs to' will be the customer that the design belongs to
//I also need to implement a 'clear form' function here so the form is empty after the post.
  values = [req.body.name,req.body.height_in_inches,req.body.width_in_inches,req.body.image_file_name,req.body.userId,req.body.userId];
    
  pool.query(queryString,values ).then((results)=>{
    res.sendStatus(201);
  }).catch((err)=>{
    console.log(err);
    res.sendStatus(400);
  })
  });
  //end of the get for DesignList

  module.exports = router;