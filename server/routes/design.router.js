// these are the imports Brad thought were necessary
const router = require('express').Router();
const pool = require('../modules/pool');


//have the authentication part of the get route (brad thinks he needs this so that this route is 
//"protected"... but Brad is not 100% certain about it)
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

router.get('/', (req, res) => {
    console.log ("Designs route WTF");
    // Get all of the users from the database
    const queryText = `SELECT * FROM "designs";`;
    pool.query(queryText)
        .then((result) => {
          console.log(result.rows);
            res.send(result.rows);
        })
        .catch((error) => {
            console.log(`Error making database query ${queryText}`, error);
            res.sendStatus(500);
        });
  });

  router.get('/:id', (req,res) => {
    const {id} = req.params;
    const queryText = `SELECT * FROM "designs" WHERE id = $1;`;
    pool
      .query(queryText)
      .then((result) =>{
        res.send(result.rows[0]);
      })
      .catch((error) =>{
        console.log('Error GET /api/design/id',error);
        res.sendStatus(500);
      });
  });
  
  router.post('/',( req,res) => {
    console.log('this is req.body',req.body);
    res.send ('woof');
  });
  //end of the get for DesignList

  module.exports = router;