//imports
import axios from 'axios';
import { useEffect, useState } from 'react';

function DesignList() {
//setters and getters
let [designList, setDesignList] = useState([]);

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
  }).catch((err)=>{
      console.log(err);
  });
};

  return (
    <>
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Designs</th>
                    </tr>
                </thead>
                <tbody>
                    {designList.map(designs => (
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
export default DesignList;