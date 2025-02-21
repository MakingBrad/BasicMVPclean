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

  // router.get('/:id', (req,res) => {
  //   const {id} = req.params;
  //   const queryText = `SELECT * FROM "designs" WHERE id = $1;`;
  //   pool
  //     .query(queryText)
  //     .then((result) =>{
  //       res.send(result.rows[0]);
  //     })
  //     .catch((error) =>{
  //       console.log('Error GET /api/design/id',error);
  //       res.sendStatus(500);
  //     });
  // });
  //MY POST ROUTE IS ALL SCREWY, I WANT TO USE REQ.USER IN THIS SO I CAN KNOW WHO DID THE 
  //CREATION OF THE DESIGN. ALSO, I DUNNO HOW TO 'UNPACK' REQ.BODY SO IT GOES INTO THE INSERT FUNCTION

  router.post('/',( req,res) => {
    let newDesign = req.body;
    console.log('in post design.router, this is req.body',req.body);
    const queryString = 'INSERT INTO designs (name,height_in_inches,width_in_inches,image_file_name,design_created_by,belongs_to_user) VALUES($1,$2,$3,$4,$5,$6);'

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