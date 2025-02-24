// Required imports for component functionality
// useStore: Global state management for user data
// useNavigate: React Router hook for programmatic navigation
// useState: React hook for local state management
// axios: HTTP client for API requests
// SelectUserDropDown: Custom component for admin user selection
import useStore from '../../zustand/store';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import SelectUserDropDown from '../SelectUserDropDown/SelectUserDropDown';

// Main component for creating new designs
// Handles both regular user design creation and admin design assignment

const CreateDesign = () => {
  // Navigation hook for redirecting after operations
  const navigate = useNavigate();
  // Get current user from global state, includes access level
  const user = useStore((store) => store.user);
  
  // Local state for form fields
  const [name, setName] = useState(""); // Design name
  const [height_in_inches, setHeight_in_inches] = useState(""); // Design height
  const [width_in_inches, setWidth_in_inches] = useState(""); // Design width
  // State for admin user assignment feature
  const [selectedUserId, setSelectedUserId] = useState('');

  // Callback handler for SelectUserDropDown component
  // Updates selectedUserId when admin selects a user to assign the design to
  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
  };

  // Main form submission handler
  // Creates new design with image upload and optional user assignment
  const handleCreateDesign = async (e) => {
    e.preventDefault();
    try {
      // Create FormData object for multipart/form-data submission
      // Required for handling file uploads along with text data
      const formData = new FormData();
      formData.append("name", name); // Design name
      formData.append("height_in_inches", height_in_inches); // Height measurement
      formData.append("width_in_inches", width_in_inches); // Width measurement
      
      // Image file handling
      // Gets file input element and checks for file selection
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput.files[0]) {
        // Append the selected image file to form data
        formData.append("image_file_name", fileInput.files[0]);
      } else {
        // Validation: Ensure an image is selected
        alert("Please select an image file");
        return;
      }
      
      // User assignment handling
      formData.append("userId", user.id); // Current user ID
      // If admin is creating design for another user, include selected user's ID
      if (user.access_level === 'admin' && selectedUserId) {
        formData.append("selectedUserId", selectedUserId);
      }

      // API request to create new design
      // Uses multipart/form-data for handling file upload
      await axios.post("/api/design", formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // Required for file uploads
        }
      });
      
      // Success feedback and navigation
      alert("Your Design has been saved!");
      navigate('/designs'); // Redirect to designs list after successful creation
    } catch (error) {
      // Error handling with user feedback
      console.error('Error adding design:', error);
      alert('Error creating design. Please try again.');
    }
  };

  return (
    // Main container with padding for form layout
    <div style={{ padding: '20px' }}>
      <h1>Create New Design</h1>
      {/* Admin-only section: User selection dropdown */}
      {user.access_level === 'admin' && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Select User to Create Design For:</h3>
          <SelectUserDropDown onUserSelect={handleUserSelect} />
        </div>
      )}
      {/* Design creation form with fields for name, dimensions, and image */}
      <form onSubmit={handleCreateDesign}>
        {/* Design name input field */}
        <div style={{ marginBottom: '15px' }}>
          <input
            placeholder="Design Name"
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            style={{ padding: '8px', width: '100%', maxWidth: '300px' }}
          />
        </div>
        {/* Height input field with number type for validation */}
        <div style={{ marginBottom: '15px' }}>
          <input
            type="number"
            placeholder="Height (inches)"
            required
            value={height_in_inches}
            onChange={(e) => setHeight_in_inches(e.target.value)}
            style={{ padding: '8px', width: '100%', maxWidth: '300px' }}
          />
        </div>
        {/* Width input field with number type for validation */}
        <div style={{ marginBottom: '15px' }}>
          <input
            type="number"
            placeholder="Width (inches)"
            required
            value={width_in_inches}
            onChange={(e) => setWidth_in_inches(e.target.value)}
            style={{ padding: '8px', width: '100%', maxWidth: '300px' }}
          />
        </div>
        {/* Image file input with accept attribute for image files only */}
        <div style={{ marginBottom: '15px' }}>
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => console.log('File selected:', e.target.files[0])}
            style={{ padding: '8px', width: '100%', maxWidth: '300px' }}
          />
        </div>
        {/* Form action buttons: Save and Cancel */}
        <div>
          <button 
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Save Design
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/designs')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              marginLeft: '10px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDesign;
