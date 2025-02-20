// these are the imports Brad thought were necessary
const express = require('express');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

//define the router for the code below it
const router = express.Router();

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

router.get('/all', (req, res) => {
    console.log ("Designs route WTF");
    // Get all of the users from the database
    const sqlText = `SELECT * FROM "designs"`;
    pool.query(sqlText)
        .then((result) => {
          console.log(result.rows);
            res.send(result.rows);
        })
        .catch((error) => {
            console.log(`Error making database query ${sqlText}`, error);
            res.sendStatus(500);
        });
  });
  //end of the get for DesignList

  module.exports = router;