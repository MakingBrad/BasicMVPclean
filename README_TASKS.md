I have the user list get route up -yea

ERROR ISSUE: 500 ERROR WHEN REGISTERING

I need to make the following components:
--Users Items--
o-  The user list needs to have a button on each entry for editing a user
o-  Edit User - Add first name and last name to the user- this is the put request, it requires the ID of the user - req.user.id (I think)
        o-The user (not admin) needs to be able to adjust their info.
        o-Admin needs to be able to adjust info for ANY users info.
--Designs--
o-  Design List - info only (not images yet)
o-  Design List - with images (even if you don't upload the image, you can
    have the images saved to the directory, and the image name placed in the DB)
o-  Create Design (no image, just the text)

o-  

**This is the code associataed with the tutorial from Karter and marc**

His cards router has the following code:
//POST ('/',rejectUnauthenticated,  (req,res) =>{
    console.log('in /api/cards POST: objectTosend', req.body)
    console.log('in /api/cards POST: user', req.user)
    const queryString - 'INSERT INTO "cards" (id, card_name, card_number, etc...)
    VALUES ($1, $2, $3, ETC.)
values = [];
pool.query( queryString, values ).then( (results)=>{
    res.sendStatus(201);
}).catch((err)=>{
    console.log( err);
    res.sendStatus(400);
})
}) 
His component "AddCardPage" has the following in it
(it also has a bunch of imports - most likely Brad knows what these should be - if not you can see them on 13:16 of the video)

function addCard(){
console.log('in addCard()')
const objectToSend={
    name:document.getElementById('nameIn').value,
    number:document.getElementById('numberIn').value,
    info:document.getElementById('infoIn').value
}
axios.post('/api/cards', objectToSend ).then( function( response){
    console.log('back from POST', response);

}).catch( function( err){
    console.log( err);
    alert('error adding card');
})

}
at 23:36 - he has the VALUES with ${req.user.id}
at 26:05 - he has the values = [req.body.card_name, req.body.card_number, Req.body.info, req.user.id, req.body.front_image_url, ect...]
(notice the req.user.id - that comes from passport, not the form data)
at 27:13 Marc points out how the object to send doesn't look like the queryString structure... it needs to.
at 29:11 - Marc looks at the "addCardPage" component, (which has the form data think:getElementById)
29:48 - Marc has Karter change the values to the keyvalue from the array that is created from the form data (this is IMPORTANT)
30:48 - kaarter decides to change the key values in the array (that is created from the form data) so that it passes through properly
(he doesn't have to do it this way - but Marc thinks it is 'the better way')