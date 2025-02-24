// Required imports for the HomePage component
// useStore: Global state management for user data and actions
// Component imports for different sections of the home page
import useStore from '../../zustand/store'
import UserList from '../UserList/UserList';
import DesignList from '../DesignList/DesignList';
import SingleUserDesigns from '../SingleUserDesigns/SingleUserDesigns';
import SelectUserDropDown from '../SelectUserDropDown/SelectUserDropDown';

// HomePage Component
// Purpose: Main landing page after login
// Features:
// - Displays user information
// - Shows admin-specific content when applicable
// - Integrates multiple sub-components
// - Provides logout functionality

function HomePage() {
  // Global state selectors
  const user = useStore((state) => state.user);    // Current user information
  const logOut = useStore((state) => state.logOut); // Logout function

  return (
    <>
      {/* Page header and user information section */}
      <h2>Home Page</h2>
      <p>Your username is: {user.username}</p>
      <p>Your ID is: {user.id}</p>

      {/* Admin privilege notification */}
      {user.user_is_admin ? (
        <p>You have admin privileges - use them wisely.</p>
      ) : null}
      
      {/* Logout button */}
      <button onClick={logOut}>
        Log Out
      </button>

      {/* User selection dropdown - accessible location for admin functions */}
      <SelectUserDropDown/>

      {/* Conditional rendering based on user role:
          - Admins see DesignList (all designs)
          - Regular users see SingleUserDesigns (their designs only) */}
      {user.user_is_admin ? (
        <DesignList/>
      ) : (
        <SingleUserDesigns/>
      )}
      {/* <h1>this is a list of the "all design list"</h1>
      <DesignList/>
      <h1>this "ties to" the singleUserDesigns</h1>
      <SingleUserDesigns/> */}
      {/* Default design image display */}
      <div style={{ marginTop: '20px' }}>
        <img 
          src="/images/KRSM_RED.jpg"
          alt="Default Design"
          style={{ maxHeight: '300px' }}
        />
      </div>

      {/* User list section */}
      <h1>This is the list of the users</h1>
      <UserList/> {/* Component for displaying all users */}
      
    </>
  );
}
export default HomePage;
