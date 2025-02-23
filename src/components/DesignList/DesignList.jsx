//imports
import axios from 'axios';
import { useEffect, useState } from 'react';

function DesignList() {
//setters and getters
const [designList, setDesignList] = useState([]);

useEffect(() => {
  console.log('DesignList Component in useEffect')

 getDesignList();
}, []);
console.log (designList);

const getDesignList = () => {
  axios({
      method: 'GET',
      url: '/api/design/all'
  }).then((response) => {
      setDesignList(response.data);
      console.log("this is the data coming back from the axios fetch",response.data)
  }).catch((err)=>{
      console.log(err);
  });
};

  return (
    <>
        <div>
            <p>Please note: This is a list of all designs, for all users.</p>
            <table class="content-table">
                <thead>
                    <tr>
                        <th>Design Name</th>
                        <th>Sticker Height</th>
                        <th>Sticker Width</th>
                        <th>Image of Sticker</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {designList.map(designs => (
                        <tr key={designs.id}>
                            <td>
                                {designs.name}
                            </td>
                            <td>
                                {designs.height_in_inches}  inches
                            </td>
                            <td>
                                {designs.width_in_inches}  inches 
                            </td>
                            <td>
                                <img src={designs.image_file_name} height="100"></img> 
                            </td>
                            <td>
                                <button>Edit</button>
                            </td>
                            <td>
                                <button>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </>
  );


}
export default DesignList;