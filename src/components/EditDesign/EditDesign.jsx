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
      <h1>Edit your design name:</h1>
      <p>Design Name: -Height: -Width: Image</p>
    </>
  );


}
export default EditDesign;