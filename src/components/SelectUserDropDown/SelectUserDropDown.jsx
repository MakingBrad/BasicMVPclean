//imports
import react from "react";
import UserList from "../UserList/UserList";

function SelectUserDropDown() {
//setters and getters

// BRAD DOESN'T THINK HE NEEDS TO USE USEEFFECT IN THIS COMPONENT, BUT HERE IS THE SYNTAX, JUST IN CASE
// useEffect(() => {
//     // Clear the auth error message when the component unmounts:
//     return () => {
//       setAuthErrorMessage('');
//     }
//   }, [])

//checking to see if I have access to the userlist fro UserList.jsx component
console.log("your mom",UserList)
  return (
    <>
      <p>--TEXT FROM SelectUserDropDown.jsx --</p>

{/* <form>
  <label for="cars">Choose a car:</label>
  <select name="cars" id="cars">
    <option value="volvo">Volvo</option>
    
  </select>
  <br></br>
  <input type="submit" value="Submit"></input>
</form> */}
    </>
  );


}
export default SelectUserDropDown;