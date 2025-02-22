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
    const formData = new FormData();
    formData.append("name", name);
    formData.append("height_in_inches", height_in_inches);
    formData.append("width_in_inches", width_in_inches);
    formData.append("image_file_name", image_file_name);
    formData.append("userId", userId);
    
    const dataObject = {};
    formData.forEach((value, key) => {
        dataObject[key] = value;
    });


    // Log the data object to the console
    console.log("formdata in createdeisgn:", dataObject);
    await addDesign(formData);
    //navigate('/'); //redirect after adding design-"home"
    alert("Your Design has been saved!");
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
        
        <input
          type="file"
          placeholder="Design File Name"
          // value={image_file_name}
          onChange={(e) => setImage_file_name(e.target.files[0])}
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