// Required imports for the DesignList component
// axios: For making HTTP requests to the backend API
// React hooks: For component lifecycle and state management
// useNavigate: For programmatic navigation
// useStore: Global state management for user info
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../zustand/store';

// DesignList Component
// Purpose: Displays a comprehensive list of all designs
// Features:
// - Shows all designs in a tabular format
// - Provides edit functionality for all users
// - Provides delete functionality for admin users only
// - Handles image display and dimensions

function DesignList() {
  // State and hooks initialization
  const [designList, setDesignList] = useState([]); // Stores all designs
  const navigate = useNavigate(); // Navigation function
  const user = useStore((state) => state.user); // Current user info from global state

  // Effect hook to fetch designs when component mounts
  useEffect(() => {
    console.log('DesignList Component in useEffect')
    getDesignList(); // Initial data fetch
  }, []); // Empty dependency array means this runs once on mount

  // Debug log for design list updates
  console.log(designList);

  // Navigation handler for editing designs
  // Redirects to the edit page with the specific design ID
  const handleEdit = (designId) => {
    navigate(`/edit/${designId}`);
  };

  // Handler for design deletion (admin only)
  // Sends DELETE request and refreshes the list on success
  const handleDelete = async (designId) => {
    try {
      await axios.delete(`/api/design/${designId}`);
      getDesignList(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting design:', error);
    }
  };

  // Function to fetch all designs from the backend
  // Uses the /api/design/all endpoint which requires admin privileges
  const getDesignList = () => {
    axios({
      method: 'GET',
      url: '/api/design/all'
    }).then((response) => {
      setDesignList(response.data); // Update state with fetched designs
      console.log("this is the data coming back from the axios fetch", response.data)
    }).catch((err) => {
      console.log(err);
    });
  };

  return (
    <>
      <div>
        {/* Informational header for users */}
        <p>Please note: This is a list of all designs, for all users.</p>
        {/* Table for displaying designs in an organized format */}
        <table className="content-table">
          {/* Table header defining columns */}
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
          {/* Table body with dynamic design data */}
          <tbody>
            {/* Map through designs array to create table rows */}
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
                              {/* Image display with path correction */}
                              <img 
                                src={designs.image_file_name.replace('public/', '/')} 
                                height="100" 
                                alt={designs.name}
                              /> 
                            </td>
                            {/* Edit button available to all users */}
                            <td>
                              <button onClick={() => handleEdit(designs.id)}>Edit</button>
                            </td>
                            {/* Delete button only visible to admin users */}
                            <td>
                              {user.access_level === 'admin' && (
                                <button onClick={() => handleDelete(designs.id)}>Delete</button>
                              )}
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
