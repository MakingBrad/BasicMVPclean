//imports
import axios from 'axios';
import useStore from '../../zustand/store'
import { useEffect, useState } from 'react';

function SingleUserDesigns() {
//setters and getters
const user = useStore((state) => state.user);

const [singleUserDesigns, setSingleUserDesigns] = useState([]);
// make axios call for all the users designs
// I will need to pass the parameter 'user id' in the get function to the
//server through the axios call - I will need to have an error statement 
//(in case it doesn't work)
//
useEffect(() => {
    // Clear the auth error message when the component unmounts:
    
    return () => {
      fetchSingleUserDesigns(user);
    }
  }, [])

const fetchSingleUserDesigns = (user) => {
  axios({
      method: 'GET',
      url: `/api/design/${user.id}`
  }).then((response) => {
    // this doesn't look right down here
      setSingleUserDesigns(response.data);
      console.log("this is single users designs data:", response.data);
  }).catch((err)=>{
      console.log(err);
  });
};


  return (
    <>
   <p>This is text residing in SingleUserDesigns component.</p>
   <div>
            <table>
                <thead>
                    <tr>
                        <th>Designs</th>
                    </tr>
                </thead>
                <tbody>
                    {singleUserDesigns.map(designs => (
                        <tr key={designs.id}>
                            <td>
                                {designs.name}
                            </td>
                            <td>
                                {designs.height_in_inches}
                            </td>
                            <td>
                                {designs.width_in_inches}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </>
  );


}
export default SingleUserDesigns;