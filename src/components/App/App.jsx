// Required imports for the App component
// React hooks
import { useEffect } from 'react';
// React Router components for routing
import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";

// Global state management
import useStore from '../../zustand/store';
// Component imports for different routes
import Nav from '../Nav/Nav';                                 // Navigation bar
import HomePage from '../HomePage/HomePage';                  // Main landing page
import LoginPage from '../LoginPage/LoginPage';              // Authentication
import RegisterPage from '../RegisterPage/RegisterPage';      // User registration
import CreateDesign from '../CreateDesign/CreateDesign';     // Admin design creation
import SingleUserDesigns from '../SingleUserDesigns/SingleUserDesigns'; // User designs
import EditDesign from '../EditDesign/EditDesign';          // Design editing

// App Component
// Purpose: Root component of the application
// Features:
// - Handles routing and navigation
// - Manages authentication state
// - Provides protected routes
// - Renders common layout elements (header, footer)

function App() {
  // Global state selectors
  const user = useStore((state) => state.user);          // Current user data
  const fetchUser = useStore((state) => state.fetchUser); // Function to fetch user

  // Effect to fetch user data on component mount
  // This ensures authentication state is maintained on page refresh
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <>
      {/* Site Header */}
      <header>
        <h2>TwinCitySticker.com</h2>
        <Nav /> {/* Navigation component */}
      </header>

      {/* Main Content Area */}
      <main>
        <p>Live in Minnesota? Like Stickers? You're gonna love us!</p>
        
        {/* Route Configuration */}
        <Routes>
          {/* Home Route - Protected */}
          <Route 
            exact path="/"
            element={
              user.id ? (
                <HomePage /> // Render HomePage for authenticated user.
              ) : (
                <Navigate to="/login" replace /> // Redirect unauthenticated user.
              )
            }
          />
          {/* Login Route - Redirects if already authenticated */}
          <Route 
            exact path="/login"
            element={
              user.id ? (
                <Navigate to="/" replace /> // Redirect authenticated user.
              ) : (
                <LoginPage /> // Render LoginPage for unauthenticated user.
              )
            }
          />
          {/* Registration Route - Redirects if already authenticated */}
          <Route 
            exact path="/registration"
            element={
              user.id ? (
                <Navigate to="/" replace /> // Redirect authenticated user.
              ) : (
                <RegisterPage /> // Render RegisterPage for unauthenticated user.
              )
            }
          />
          {/* Edit Design Route - Protected */}
          <Route 
            exact path="/edit/:id"
            element={
              user.id ? (
                <EditDesign />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          {/* Designs List Route - Protected */}
          <Route 
            exact path="/designs"
            element={
              user.id ? (
                <SingleUserDesigns />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          {/* Create Design Route - Admin Only */}
          <Route 
            exact path="/CreateDesign"
            element={
              user.access_level === 'admin' ? (
                <CreateDesign />
              ) : (
                <Navigate to="/" replace /> // Redirect non-admin users
              )
            }
          />
          {/* Public About Page */}
          <Route 
            exact path="/about"
            element={
              <>
                <h2>About Page</h2>
                <p>
                  Intelligence doesn’t seem like an aspect of personal character, and it isn’t.
                  Coincidentally, great intelligence is only loosely connected to being a good programmer.
                </p>
                <p>
                  What? You don’t have to be superintelligent?
                </p>
                <p>
                  No, you don’t. Nobody is really smart enough to program computers.
                  Fully understanding an average program requires an almost limitless capacity
                  to absorb details and an equal capacity to comprehend them all at the same time.
                  The way you focus your intelligence is more important than how much intelligence you have…
                </p>
                <p>
                  …most of programming is an attempt to compensate for the strictly limited size of our skulls.
                  The people who are the best programmers are the people who realize how small their brains are.
                  They are humble. The people who are the worst at programming are the people who refuse to
                  accept the fact that their brains aren’t equal to the task.
                  Their egos keep them from being great programmers.
                  The more you learn to compensate for your small brain, the better a programmer you’ll be.
                  <span className="squiggle"> The more humble you are, the faster you’ll improve.</span>
                </p>
                <p>
                  --From Steve McConnell's <em>Code Complete</em>.
                </p>
              </>
            }
          />
          {/* 404 Catch-all Route */}
          <Route
            path="*"
            element={
              <h2>404 Page</h2>
            } 
          />
        </Routes>
      </main>

      {/* Site Footer */}
      <footer>
        <p>Copyright © {new Date().getFullYear()}</p>
      </footer>
    </>
  );
}


export default App;
