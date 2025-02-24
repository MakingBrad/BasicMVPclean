// Required imports for the Nav component
// NavLink: React Router component for navigation with active state
// useStore: Global state management for user data
import { NavLink } from 'react-router-dom';
import useStore from '../../zustand/store';

// Nav Component
// Purpose: Main navigation bar of the application
// Features:
// - Conditional rendering based on authentication status
// - Role-based navigation options (admin vs regular user)
// - Active link highlighting through NavLink
// - Responsive to user authentication state

function Nav() {
  // Get current user from global state
  const user = useStore((store) => store.user);

  return (
    <nav>
      <ul>
        {/* Authentication-dependent navigation section */}
        {/* When user is not logged in, show login/register options */}
        {/* Authentication-dependent navigation */}
        {!user.id && (
          <>
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
            <li>
              <NavLink to="/registration">Register</NavLink>
            </li>
          </>
        )}

        {/* Authenticated user navigation */}
        {user.id && (
          <>
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            {/* Regular user sees "My Designs" */}
            {user.access_level !== 'admin' && (
              <li>
                <NavLink to="/designs">My Designs</NavLink>
              </li>
            )}
            {/* Admin sees "View Designs" - same route, different label */}
            {user.access_level === 'admin' && (
              <li>
                <NavLink to="/designs">View Designs</NavLink>
              </li>
            )}
          </>
        )}

        {/* Admin-only navigation section */}
        {user.access_level === 'admin' && (
          <li>
            <NavLink to="/CreateDesign">Create Design</NavLink>
          </li>
        )}
      {/* Public navigation section */}
      {/* These links are always visible regardless of auth status */}
      <li>
        <NavLink to="/about">About</NavLink>
      </li>
      </ul>
    </nav>
  );
}


export default Nav;
