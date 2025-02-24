// Required imports for the SelectUserDropDown component
// useEffect: React hook for handling side effects (like data fetching)
// useStore: Custom Zustand store hook for global state management
import { useEffect } from "react";
import useStore from '../../zustand/store';

// SelectUserDropDown Component
// Purpose: Provides a dropdown interface for selecting users
// Used by admin users to assign designs to specific users
// Props:
// - onUserSelect: Callback function that receives the selected user ID

function SelectUserDropDown({ onUserSelect }) {
  // Zustand state selectors
  const userList = useStore((state) => state.userList);       // Array of all users
  const getUserList = useStore((state) => state.getUserList); // Function to fetch users
  const userSelect = useStore((state) => state.userSelect);   // Currently selected user
  const setUserSelect = useStore((state) => state.setUserSelect); // Function to update selection

  // Effect hook to fetch user list when component mounts
  // This ensures the dropdown has data to display
  useEffect(() => {
    getUserList(); // Fetch users from the backend
  }, []); // Empty dependency array means this runs once on mount

  // Event handler for dropdown selection changes
  const handleChange = (e) => {
    const selectedUserId = e.target.value;
    setUserSelect(selectedUserId);    // Update global state
    if (onUserSelect) {
      onUserSelect(selectedUserId);   // Notify parent component of selection
    }
  };
  
  return (
    <div>
      {/* Dropdown select element */}
      <select 
        value={userSelect} // Controlled component with value from state
        onChange={handleChange} // Handler for selection changes
      >
        {/* Default disabled option as placeholder */}
        <option value="" disabled>Select a user</option>
        {/* Map through userList to create options */}
        {userList.map(user => (
          <option 
            key={user.id} // Unique key for React list rendering
            value={user.id} // User ID as value
          >
            {user.username} {/* Display username in dropdown */}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectUserDropDown;
