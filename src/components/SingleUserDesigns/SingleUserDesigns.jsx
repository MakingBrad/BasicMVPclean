// Required imports for the SingleUserDesigns component
// axios: For making HTTP requests to the backend API
// useStore: Zustand store for global state management (user info)
// React hooks: For component lifecycle and local state
// useNavigate: For programmatic navigation
// SelectUserDropDown: For admin user selection functionality
import axios from 'axios';
import useStore from '../../zustand/store'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SelectUserDropDown from '../SelectUserDropDown/SelectUserDropDown';

// SingleUserDesigns Component
// Purpose: Displays and manages designs for individual users
// Features:
// - Shows designs based on user role (admin sees all, users see their own)
// - Provides edit and delete functionality
// - Handles image display with fallback

function SingleUserDesigns() {
  // Hooks initialization
  const navigate = useNavigate();
  const user = useStore((state) => state.user); // Current user from global state
  
  // Local state management
  const [singleUserDesigns, setSingleUserDesigns] = useState([]); // List of designs
  const [selectedUserId, setSelectedUserId] = useState(null); // For admin user filtering

  // Effect hook to fetch designs when component mounts or dependencies change
  useEffect(() => {
    if (user && user.id) {
      fetchDesigns(); // Fetch designs if user is authenticated
    }
  }, [user, selectedUserId]); // Re-fetch when user or selected user changes

  // Handler for user selection (admin feature)
  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
  };

  // Navigation handler for editing designs
  // Redirects to the edit page with the design ID
  const onEdit = (designId) => {
    navigate(`/edit/${designId}`); // Uses dynamic routing
  };

  // Handler for design deletion (admin only)
  const handleDelete = async (designId) => {
    try {
      await axios.delete(`/api/design/${designId}`);
      fetchDesigns(); // Refresh the list after deletion
      alert('Design has been deleted.');
    } catch (error) {
      console.error('Error deleting design:', error);
      alert('Error deleting design. Please try again.');
    }
  };

  // Main function to fetch designs from the backend
  // Handles different data access based on user role
  const fetchDesigns = async () => {
    try {
      let response;
      if (user.access_level === 'admin') {
        // Admin sees all designs by default
        response = await axios.get('/api/design/all');
      } else {
        // Regular users only see their own designs
        response = await axios.get(`/api/design/user/${user.id}`);
      }
      setSingleUserDesigns(response.data);
    } catch (err) {
      console.error('Error fetching designs:', err);
    }
  };


  return (
    <>
   <div>
   {/* Admin-specific header section */}
   {user.access_level === 'admin' && (
      <div>
        <h2>All User Designs</h2>
        <p>You can view and manage all designs as an admin.</p>
        <hr />
      </div>
    )}
   {/* Dynamic header text based on user role */}
   <p>This is a list of {user.access_level === 'admin' ? "all" : "your"} sticker designs.</p>
              {/* Table for displaying designs */}
              <table className="content-table">
                {/* Table header with column definitions */}
                <thead>
                    <tr>
                        <th>Design Name</th>
                        <th>Height</th>
                        <th>Width</th>
                        <th>Sticker image</th>
                        <th>Edit</th>
                        <th>Delete</th>

                    </tr>
                </thead>
                {/* Table body with dynamic design data */}
                <tbody>
                    {/* Map through designs array to create table rows */}
                    {singleUserDesigns.map(designs => (
                        <tr key={designs.id}>
                            <td>
                                {designs.name}
                            </td>
                            <td>
                                {designs.height_in_inches} inches
                            </td>
                            <td>
                                {designs.width_in_inches}  inches
                            </td>
                            <td>
                                {/* Image display with fallback handling */}
                                <img 
                                    src={designs.image_file_name ? designs.image_file_name.replace('public/', '/') : '/images/KRSM_RED.jpg'} 
                                    height="100" 
                                    alt={designs.name}
                                    onError={(e) => {
                                        e.target.onerror = null; // Prevent infinite loop
                                        e.target.src = '/images/KRSM_RED.jpg'; // Fallback image
                                    }}
                                /> 
                            </td>
                            {/* Edit button cell */}
                            <td>
                                <button width="100px" onClick={() => onEdit(designs.id)}>Edit</button>
                            </td>
                            {/* Delete button cell - only visible to admin users */}
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
export default SingleUserDesigns;
