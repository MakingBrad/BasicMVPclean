//imports
import axios from 'axios';
import { useEffect, useState } from 'react';

function UserList() {
//setters and getters
let [userList, setUserList] = useState([]);

useEffect(() => {
    console.log('in useEffect')
   // getStudents();
   getUserList();
}, []);
console.log (userList);

const getUserList = () => {
    axios({
        method: 'GET',
        url: '/api/user/all'
    }).then((response) => {
        setUserList(response.data);
    }).catch((err)=>{
        console.log(err);
    });
};
//this use effect with setAuthErrorMessage came with the base repo...
//brad is not sure what it does
// useEffect(() => {
//     // Clear the auth error message when the component unmounts:
//     return () => {
//       setAuthErrorMessage('');
//     }
//   }, [])
  
  return (
    <>
       <div>
            <table>
                <thead>
                    <tr>
                        <th>UserNames</th>
                    </tr>
                </thead>
                <tbody>
                    {userList.map(user => (
                        <tr key={user.id}>
                            <td>
                                {user.first_name}
                            </td>
                            <td>
                                {user.last_name}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </>
  );


}
export default UserList;