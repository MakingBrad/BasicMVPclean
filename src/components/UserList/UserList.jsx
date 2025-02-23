//imports
import axios from 'axios';
import { useEffect, useState } from 'react';
import useStore from '../../zustand/store';

function UserList() {
//setters and getters
//line below from before I was using the store
// let [userList, setUserList] = useState([]);
const userList = useStore((state) => state.userList);
const getUserList = useStore((state) => state.getUserList);

useEffect(() => {
    console.log('Userlist Component in useEffect')
  
   getUserList();
}, []);
// console.log (userList);

//this fetch is going into the store
//probably delete it when you have this call complete in the store
// const getUserList = () => {
//     axios({
//         method: 'GET',
//         url: '/api/user/all'
//     }).then((response) => {
//         setUserList(response.data);
//     }).catch((err)=>{
//         console.log(err);
//     });
// };
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
        <p>{JSON.stringify(userList)}</p>
        <ul>
            {userList.map(user=> (
                <li key={user.id}>{user.username}</li>
            ))}
        </ul>
            {/* <table>
                <thead>
                    <tr>
                        <th>{JSON.stringify(userList)}</th> 
                    </tr>
                </thead>
                <tbody>
                    {userList.map(user => (
                        <tr key={user.id}>
                            <td>
                                {user.username}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table> */}
        </div>
    </>
  );


}
export default UserList;