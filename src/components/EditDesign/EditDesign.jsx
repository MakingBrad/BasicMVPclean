//Component tasks:
//o-fetchOneDesign - this will fetch the single design you want AXIOS GET
//o-Render it to the DOM - with a save button
//o-Make some information not-editable
//o-Have an on-change for the name
//o-Pull the name from the form, package it, and PUT it to the router
//o-Alert "saved" then return to the home page

//imports


function EditDesign() {
//setters and getters

// HEY BRAD - YOU HAVE NOT CALLED THIS FUNCTION YET, AND USE EFFECT
// WILL COME IN HANDY.(ITS RIGHT BELOW HERE...)
// useEffect(() => {
//     // Clear the auth error message when the component unmounts:
//     return () => {
//       setAuthErrorMessage('');
//     }
//   }, [])

  return (
    <>
    {/* gonna need a background color for the background of the stickerframe of white */}
    <div class="image-frame">
    <img src="public/images/KRSM_BLACK.jpg" height = "300" alt="" />
    <p>I am using krsm black as a placeholder.</p>
    </div>
      <h1>Your Design's information:</h1>
      <h3>Feel free to change the name of your design.</h3>
      {/* <form onSubmit={handleEditSave}>
         <input
          placeholder="Design Name"
          type="text"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />
       
        <input
          type="number"
          placeholder = "Height"
          required
          readonly
          value={height_in_inches}
          onChange={(e) => setHeight_in_inches(e.target.value)}
        />
         
        <input
          type="number"
          placeholder="Width"
          required
          readonly
          value={width_in_inches}
          onChange={(e) => setWidth_in_inches(e.target.value)}
        />
        
        <input
          type="file"
          placeholder="Design File Name"
          // value={image_file_name}
          onChange={(e) => setImage_file_name(e.target.files[0])}
        /> 
        <button type="submit">
          Save Design 
        </button>
      
      </form> */}
    </>
  );


}
export default EditDesign;