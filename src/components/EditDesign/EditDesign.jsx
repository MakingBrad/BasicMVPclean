// Required imports for the EditDesign component
// React hooks for state and side effects
import { useState, useEffect } from 'react';
// React Router hooks for navigation and URL parameters
import { useParams, useNavigate } from 'react-router-dom';
// HTTP client for API requests
import axios from 'axios';
// Global state management
import useStore from '../../zustand/store';

// EditDesign Component
// Purpose: Allows users to edit their design details
// Features:
// - Displays design image with fallback
// - Allows editing of design name
// - Shows read-only dimensions
// - Handles permissions and errors

function EditDesign() {
  // State management
  const [design, setDesign] = useState(null);    // Holds complete design data
  const [name, setName] = useState('');          // Editable design name
  const [error, setError] = useState(null);      // Error state for user feedback
  
  // Route and navigation hooks
  const { id } = useParams();                    // Get design ID from URL
  const navigate = useNavigate();                // Navigation function
  
  // Global state
  const user = useStore((state) => state.user);  // Current user info

  // Effect to fetch design data when component mounts or ID changes
  useEffect(() => {
    fetchDesign();
  }, [id]); // Re-fetch when design ID changes

  // Function to fetch design details from the backend
  const fetchDesign = async () => {
    try {
      const response = await axios.get(`/api/design/${id}`);
      setDesign(response.data);
      setName(response.data.name);
      setError(null);
    } catch (error) {
      console.error('Error fetching design:', error);
      if (error.response?.status === 404) {
        // Just show the default image without the edit panel
        return navigate('/');
      } else if (error.response?.status === 403) {
        setError('You do not have permission to edit this design.');
      } else {
        setError('An error occurred while fetching the design.');
      }
    }
  };

  // Handler for form submission to save design changes
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/design/${id}`, { name });
      alert('Design name has been updated successfully.');
      navigate('/designs'); // Navigate back to designs list
    } catch (error) {
      console.error('Error updating design:', error);
      if (error.response?.status === 403) {
        alert('You do not have permission to edit this design.');
      } else {
        alert('Error updating design. Please try again.');
      }
    }
  };

  // Error state rendering
  // Shows error message and back button when there's an error
  if (error) {
    return (
      <div style={{ 
        color: 'red', 
        padding: '20px',
        textAlign: 'center',
        marginTop: '20px'
      }}>
        <h2>{error}</h2>
        <button 
          onClick={() => navigate('/designs')}
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  // Main component render
  // Only renders when design data is available
  return (
    <>
    {design && (
      <div style={{ padding: '20px' }}>
        <h1>Edit Design</h1>
        {/* Image display section with styling */}
        <div className="image-frame" style={{ 
          backgroundColor: 'white', 
          padding: '20px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          {/* Design image with fallback handling */}
          <img 
            src={design.image_file_name ? design.image_file_name.replace('public/', '/') : '/images/KRSM_RED.jpg'} 
            height="300" 
            alt={design.name}
            style={{ maxWidth: '100%', height: 'auto', maxHeight: '300px' }}
            onError={(e) => {
              e.target.onerror = null; // Prevent infinite loop
              e.target.src = '/images/KRSM_RED.jpg';
            }}
          />
        </div>
        {/* Edit form with responsive styling */}
        <form onSubmit={handleSave} style={{ maxWidth: '500px', margin: '0 auto' }}>
          {/* Name input field - editable */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Design Name:</label>
            <input
              type="text"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              style={{ 
                padding: '8px', 
                width: '100%', 
                maxWidth: '300px',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
            />
          </div>
          
          {/* Height display - read only */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Height:</label>
            <span>{design.height_in_inches} inches</span>
          </div>
          
          {/* Width display - read only */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Width:</label>
            <span>{design.width_in_inches} inches</span>
          </div>
          
          {/* Form action buttons */}
          <div style={{ marginTop: '20px' }}>
            {/* Save button - triggers handleSave */}
            <button 
              type="submit"
              style={{ 
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              Save Changes
            </button>
            {/* Cancel button - returns to designs list */}
            <button 
              type="button" 
              onClick={() => navigate('/designs')}
              style={{ 
                padding: '10px 20px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    )}
    </>
  );
}

export default EditDesign;
