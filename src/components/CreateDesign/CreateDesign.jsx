//imports
import useStore from '../../zustand/store';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const CreateDesign = () => {
  const navigate = useNavigate();
//define the design function
const addDesign = useStore((store) => store.addDesign);
//define the existence of the array that is designDetails
const designDetails = useStore((store) => store.designDetails);
const user = useStore((store) => store.user);
const [name,setName] = useState("");
const [height_in_inches,setHeight_in_inches] = useState("");
const [width_in_inches, setWidth_in_inches] = useState("");
const [image_file_name, setImage_file_name] = useState("");
//Pack up the designDetails... in one nice package
//const {name, height_in_inches, width_in_inches, image_file_name}= designDetails;

const handleCreateDesign = async (e) => {
  e.preventDefault();
  console.log (user);
  const userId = user.id
  try {
    await addDesign({name, height_in_inches, width_in_inches, image_file_name,userId});
    //navigate('/'); //redirect after adding design-"home"
  } catch (error) {
    console.error('Error adding design:', error);
  }
};
  return (
    <>
    <h1>This is the create design page</h1> 
    <h2>Fill out the information on your Design:</h2>
      <form onSubmit={handleCreateDesign}>
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
          value={height_in_inches}
          onChange={(e) => setHeight_in_inches(e.target.value)}
        />
         
        <input
          type="number"
          placeholder="Width"
          required
          value={width_in_inches}
          onChange={(e) => setWidth_in_inches(e.target.value)}
        />

        // Brad Decided that the image file name was not required
        
        <input
          type="file"
          placeholder="Design File Name"
          value={image_file_name}
          onChange={(e) => setImage_file_name(e.target.value)}
        /> 
        <button type="submit">
          Save Design 
        </button>
        {/* Brad, do you want a cancel button? */}
      </form>


    </>
  );


}
export default CreateDesign;