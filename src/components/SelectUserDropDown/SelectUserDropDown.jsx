//imports
import react from "react";
import { useState } from "react";
import useStore from '../../zustand/store';
import { useEffect } from "react";



function SelectUserDropDown() {
  const userList = useStore((state) => state.userList);
  const getUserList = useStore((state) => state.getUserList);
  const userSelect = useStore((state) => state.userSelect);
  const setUserSelect = useStore((state) => state.setUserSelect);

  useEffect(() => {
  
   getUserList();
  }, []);
  
  
    return (
    <>
      <p>--TEXT FROM SelectUserDropDown.jsx --</p>

<form>
  <select value={userSelect} onChange= {(e) => setUserSelect(e.target.value)}>

    <option value="" disabled>Select a user</option>
        {userList.map(user =>(
          <option key={user.id} value={user.id}> {user.username} </option>
        ))};

  </select>

  <br></br>
  <input type="submit" value="Submit"></input>
</form>
{JSON.stringify(userSelect)};
    </>
  );


}
export default SelectUserDropDown;