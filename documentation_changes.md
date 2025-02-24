# Complete Documentation of Codebase Changes and Implementations

## Table of Contents
1. [Introduction](#introduction)
2. [File Structure Overview](#file-structure-overview)
3. [Frontend Architecture](#frontend-architecture)
4. [Backend Architecture](#backend-architecture)
5. [Component Modifications](#component-modifications)
6. [API Integration](#api-integration)
7. [Error Handling Implementation](#error-handling-implementation)
8. [Image Display System](#image-display-system)
9. [Routing System](#routing-system)
10. [Database Integration](#database-integration)
11. [Testing Guide](#testing-guide)

## Introduction
This documentation provides a comprehensive overview of all modifications and implementations made to both the frontend and backend of the codebase. It's structured to help developers understand the full stack changes, their purposes, and how different parts of the application interact with each other.

## Recent Updates and Fixes
### 404 Error Handling Improvements
- **Original Issue**: EditDesign component was showing error messages and edit panel on 404
- **Solution Implemented**: 
  ```javascript
  // EditDesign.jsx
  if (error.response?.status === 404) {
    // Just show the default image without the edit panel
    return navigate('/');
  }
  ```
  - Redirects to home page on 404 errors
  - Prevents showing broken edit panel
  - Maintains clean user experience

### Image Display Refinements
- **Original Issue**: Image was being forced to center alignment
- **Solution Implemented**:
  ```javascript
  // HomePage.jsx
  <div style={{ marginTop: '20px' }}>
    <img 
      src="/images/KRSM_RED.jpg"
      alt="Default Design"
      style={{ maxHeight: '300px' }}
    />
  </div>
  ```
  - Removed forced center positioning
  - Maintained consistent height constraints
  - Preserved natural image flow in layout
  - Kept all existing comments for context

### Key Improvements
1. Error Handling:
   - Cleaner navigation flow on 404s
   - Better user experience with redirects
   - Maintained existing error states for other scenarios

2. Image Display:
   - More natural positioning
   - Consistent sizing across components
   - Better integration with page layout

3. Code Organization:
   - Preserved all comments for future reference
   - Maintained component separation
   - Kept existing functionality intact

## Implemented Features Overview
### 1. Design Editing Functionality
- **Edit Button Implementation**
  ```javascript
  // SingleUserDesigns.jsx
  const onEdit = (designId) => {
    navigate(`/edit/${designId}`);
  };
  ```
  - Users can click edit button for their designs
  - Navigation to dedicated edit page with design ID
  - Protected route ensures only authorized access

### 2. Edit Design Page Features
- **Image Display**
  ```javascript
  // EditDesign.jsx
  <div className="image-frame">
    <img 
      src={design.image_file_name ? design.image_file_name.replace('public/', '/') : '/images/KRSM_RED.jpg'} 
      height="300" 
      alt={design.name}
      style={{ maxHeight: '300px' }}
    />
  </div>
  ```
  - Larger image display than in design list
  - Fallback image handling
  - Proper error handling for missing images

- **Metadata Display**
  ```javascript
  // EditDesign.jsx
  <div>
    <label>Height:</label>
    <span>{design.height_in_inches} inches</span>
  </div>
  <div>
    <label>Width:</label>
    <span>{design.width_in_inches} inches</span>
  </div>
  ```
  - Read-only display of height and width
  - Clear labeling of non-editable fields

- **Name Editing**
  ```javascript
  // EditDesign.jsx
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/design/${id}`, { name });
      alert('Design name has been updated successfully.');
      navigate('/designs');
    } catch (error) {
      // Error handling
    }
  };
  ```
  - Form input for name editing
  - PUT route integration
  - Success feedback with alert
  - Automatic navigation after save

### 3. Admin Delete Functionality
- **Delete Button Implementation**
  ```javascript
  // DesignList.jsx
  {user.access_level === 'admin' && (
    <button onClick={() => handleDelete(designs.id)}>Delete</button>
  )}
  ```
  - Admin-only visibility
  - Confirmation before deletion
  - Immediate UI update after deletion

- **Backend Delete Route**
  ```javascript
  // design.router.js
  router.delete('/:id', rejectUnauthenticated, async (req, res) => {
    if (req.user.access_level !== 'admin') {
      return res.sendStatus(403);
    }
    try {
      await pool.query('DELETE FROM designs WHERE id = $1', [req.params.id]);
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  });
  ```
  - Admin authentication check
  - Database deletion
  - Error handling

### 4. User Assignment System
- **SelectUserDropDown Integration**
  ```javascript
  // CreateDesign.jsx
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
  };

  // In form submission
  const handleSubmit = async () => {
    const designData = {
      // ... other design data
      user_id: selectedUserId
    };
    await axios.post('/api/design', designData);
  };
  ```
  - Admin can assign designs to specific users
  - User selection during design creation
  - Automatic update of user's design list

- **Backend Implementation**
  ```javascript
  // design.router.js
  router.post('/', rejectUnauthenticated, async (req, res) => {
    const { name, height_in_inches, width_in_inches, user_id } = req.body;
    
    // Verify admin status for user assignment
    if (user_id && req.user.access_level !== 'admin') {
      return res.sendStatus(403);
    }

    const query = `
      INSERT INTO designs 
      (name, height_in_inches, width_in_inches, user_id) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [
        name, 
        height_in_inches, 
        width_in_inches, 
        user_id || req.user.id
      ]);
      res.json(result.rows[0]);
    } catch (error) {
      res.sendStatus(500);
    }
  });
  ```
  - Secure user assignment
  - Admin privilege verification
  - Default to current user if not specified


## Frontend Architecture
### Technology Stack
- React.js for UI components
- Zustand for state management
- React Router for navigation
- Axios for API requests

### State Management
```javascript
// src/zustand/store.js
import useStore from '../../zustand/store'

// Example of state usage in components
const user = useStore((state) => state.user);
const logOut = useStore((state) => state.logOut);
```

### Component Hierarchy
```
App.jsx
├── Nav.jsx
├── HomePage.jsx
│   ├── SelectUserDropDown.jsx
│   ├── DesignList.jsx (for admins)
│   └── SingleUserDesigns.jsx (for regular users)
├── EditDesign.jsx
└── UserList.jsx
```

## Backend Architecture
### Technology Stack
- Node.js/Express server
- PostgreSQL database
- Authentication middleware
- RESTful API endpoints

### Server Structure
```
server/
├── modules/
│   ├── pool.js (database connection)
│   ├── admin-middleware.js (admin access control)
│   └── authentication-middleware.js
└── routes/
    ├── design.router.js (design-related endpoints)
    └── user.router.js (user management)
```

### API Endpoints and Backend Routes
```javascript
// server/routes/design.router.js

// GET specific design
router.get('/:id', rejectUnauthenticated, async (req, res) => {
  // Authentication middleware ensures only logged-in users can access
  // rejectUnauthenticated is imported from authentication-middleware.js
  try {
    const designId = req.params.id;
    const query = `
      SELECT designs.*, users.username 
      FROM designs 
      JOIN users ON designs.user_id = users.id 
      WHERE designs.id = $1
    `;
    const result = await pool.query(query, [designId]);
    
    if (result.rows.length === 0) {
      // Design not found - triggers 404 handling in frontend
      res.sendStatus(404);
    } else {
      // Check user permissions
      const design = result.rows[0];
      if (req.user.id === design.user_id || req.user.access_level === 'admin') {
        res.json(design);
      } else {
        // User doesn't have permission - triggers 403 handling in frontend
        res.sendStatus(403);
      }
    }
  } catch (error) {
    console.error('Error in GET /api/design/:id:', error);
    res.sendStatus(500);
  }
});

// PUT (update) specific design
router.put('/:id', rejectUnauthenticated, async (req, res) => {
  try {
    const designId = req.params.id;
    const { name } = req.body;
    
    // First check if design exists and user has permission
    const checkQuery = `
      SELECT user_id FROM designs WHERE id = $1
    `;
    const checkResult = await pool.query(checkQuery, [designId]);
    
    if (checkResult.rows.length === 0) {
      return res.sendStatus(404);
    }
    
    const design = checkResult.rows[0];
    if (req.user.id !== design.user_id && req.user.access_level !== 'admin') {
      return res.sendStatus(403);
    }
    
    // Update the design
    const updateQuery = `
      UPDATE designs 
      SET name = $1, 
          modified_at = CURRENT_TIMESTAMP 
      WHERE id = $2 
      RETURNING *
    `;
    await pool.query(updateQuery, [name, designId]);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error in PUT /api/design/:id:', error);
    res.sendStatus(500);
  }
});

// GET all designs (admin only)
router.get('/all', rejectUnauthenticated, async (req, res) => {
  if (req.user.access_level !== 'admin') {
    return res.sendStatus(403);
  }
  try {
    const query = `
      SELECT designs.*, users.username 
      FROM designs 
      JOIN users ON designs.user_id = users.id 
      ORDER BY designs.created_at DESC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error in GET /api/design/all:', error);
    res.sendStatus(500);
  }
});
```

### Frontend State Management (Zustand)
```javascript
// src/zustand/slices/design.slice.js

// Design slice of the store
const createDesignSlice = (set, get) => ({
  designs: [],
  currentDesign: null,
  loading: false,
  error: null,

  // Fetch specific design
  fetchDesign: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/api/design/${id}`);
      set({ currentDesign: response.data, loading: false });
    } catch (error) {
      set({ 
        error: error.response?.data || 'Failed to fetch design',
        loading: false 
      });
      throw error; // Allow components to handle specific error cases
    }
  },

  // Update design
  updateDesign: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await axios.put(`/api/design/${id}`, data);
      // Optimistically update the local state
      set(state => ({
        designs: state.designs.map(d => 
          d.id === id ? { ...d, ...data } : d
        ),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error.response?.data || 'Failed to update design',
        loading: false 
      });
      throw error;
    }
  }
});
```

### Database Schema and Relationships
```sql
-- database.sql

-- Users table with authentication and authorization
CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "username" VARCHAR(80) UNIQUE NOT NULL,
  "password" VARCHAR(1000) NOT NULL,
  "access_level" VARCHAR(50) DEFAULT 'user',
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Designs table with user relationships and metadata
CREATE TABLE "designs" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "image_file_name" VARCHAR(255),
  "height_in_inches" DECIMAL(10,2),
  "width_in_inches" DECIMAL(10,2),
  "user_id" INTEGER REFERENCES "users" ON DELETE CASCADE,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "modified_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_designs_user_id ON designs(user_id);
CREATE INDEX idx_users_username ON users(username);
```

### Authentication and Authorization Flow
```javascript
// server/modules/authentication-middleware.js
const rejectUnauthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.sendStatus(403);
  }
};

// server/modules/admin-middleware.js
const rejectNonAdmin = (req, res, next) => {
  if (req.user && req.user.access_level === 'admin') {
    next();
  } else {
    res.sendStatus(403);
  }
};

// Usage in routes
router.get('/all', rejectUnauthenticated, rejectNonAdmin, async (req, res) => {
  // Only authenticated admins can access this route
});

// Frontend authentication check
const ProtectedRoute = ({ children }) => {
  const user = useStore((state) => state.user);
  const location = useLocation();

  if (!user.id) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
```

### Database Connection Pool
```javascript
// server/modules/pool.js
const pg = require('pg');
const url = require('url');

let config = {};

if (process.env.DATABASE_URL) {
  // Heroku gives a url, not a connection object
  const params = url.parse(process.env.DATABASE_URL);
  const auth = params.auth.split(':');

  config = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: { rejectUnauthorized: false },
    max: 10, // max pool connections
    idleTimeoutMillis: 30000
  };
} else {
  config = {
    host: 'localhost',
    port: 5432,
    database: 'your_database',
    max: 10,
    idleTimeoutMillis: 30000
  };
}

const pool = new pg.Pool(config);

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;
```

## File Structure Overview
Key files in our implementation:
```
src/
  components/
    EditDesign/
      EditDesign.jsx       # Handles design editing functionality
    HomePage/
      HomePage.jsx         # Main landing page component
    SingleUserDesigns/
      SingleUserDesigns.jsx # Displays user-specific designs
public/
  images/
    KRSM_RED.jpg          # Default fallback image
```

## Frontend-Backend Integration
### Data Flow
1. User Interaction
```javascript
// Frontend request
const fetchDesign = async () => {
  try {
    const response = await axios.get(`/api/design/${id}`);
    setDesign(response.data);
  } catch (error) {
    // Error handling
  }
};
```

2. API Processing
```javascript
// Backend handling
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM designs WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      res.sendStatus(404);
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    res.sendStatus(500);
  }
});
```

3. Response Handling
```javascript
// Frontend response processing
if (error.response?.status === 404) {
  return navigate('/');
} else if (error.response?.status === 403) {
  setError('Permission denied');
}
```

## Component Modifications

### EditDesign Component (EditDesign.jsx)
#### Original Issues:
- 404 errors were showing error messages
- Edit panel was displaying even when design wasn't found
- Poor error handling UX

#### Implemented Solutions:
```javascript
const fetchDesign = async () => {
  try {
    const response = await axios.get(`/api/design/${id}`);
    setDesign(response.data);
    setName(response.data.name);
    setError(null);
  } catch (error) {
    console.error('Error fetching design:', error);
    if (error.response?.status === 404) {
      // Redirect to home on 404
      return navigate('/');
    } else if (error.response?.status === 403) {
      setError('You do not have permission to edit this design.');
    } else {
      setError('An error occurred while fetching the design.');
    }
  }
};
```

#### Key Changes:
1. Added 404 error redirection
2. Improved error message handling
3. Implemented navigation to home page for missing designs

### HomePage Component (HomePage.jsx)
#### Original Issues:
- Image positioning was forced to center
- Unnecessary styling constraints

#### Implemented Solutions:
```javascript
<div style={{ marginTop: '20px' }}>
  <img 
    src="/images/KRSM_RED.jpg"
    alt="Default Design"
    style={{ maxHeight: '300px' }}
  />
</div>
```

#### Key Changes:
1. Removed forced center alignment
2. Maintained height constraints
3. Preserved all existing comments for context

### SingleUserDesigns Component (SingleUserDesigns.jsx)
#### Features:
- Handles display of user-specific designs
- Includes edit and delete functionality
- Implements proper image fallback system

```javascript
<img 
  src={designs.image_file_name ? designs.image_file_name.replace('public/', '/') : '/images/KRSM_RED.jpg'} 
  height="100" 
  alt={designs.name}
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = '/images/KRSM_RED.jpg';
  }}
/> 
```

## Error Handling Implementation
### Types of Errors Handled:
1. 404 (Not Found)
   - Redirects to home page
   - Shows default image
2. 403 (Forbidden)
   - Shows permission error message
3. General Errors
   - Shows generic error message
   - Maintains user context

## Image Display System
### Implementation Details:
1. Default Image: KRSM_RED.jpg
2. Fallback System:
   - Primary: design.image_file_name
   - Secondary: KRSM_RED.jpg
3. Error Handling:
   - onError event handler
   - Prevents infinite loops
   - Consistent fallback

## Routing System
### Navigation Flow:
1. Edit Route (/edit/:id)
   - Checks design existence
   - Handles permissions
   - Redirects on errors
2. Home Route (/)
   - Displays default image
   - Shows user-specific content
   - Handles admin privileges

## Testing Guide
### Test Cases:
1. Invalid Design ID:
   ```
   Steps:
   1. Navigate to /edit/999 (non-existent ID)
   2. Verify redirect to home page
   3. Check default image display
   ```

2. Valid Design Edit:
   ```
   Steps:
   1. Navigate to existing design
   2. Verify edit form displays
   3. Test save functionality
   ```

3. Image Display:
   ```
   Steps:
   1. Check image positioning
   2. Verify height constraints
   3. Test fallback system
   ```

### Common Issues and Solutions:
1. 404 Errors:
   - Now handled with redirect
   - No error message displayed
   - Smooth user experience

2. Image Display:
   - Natural positioning
   - Consistent sizing
   - Proper fallback handling

## Best Practices Implemented
1. Error Handling:
   - Graceful degradation
   - User-friendly messages
   - Proper redirection

2. Code Organization:
   - Component separation
   - Clear error states
   - Maintained comments

3. User Experience:
   - Smooth navigation
   - Consistent image display
   - Clear feedback


2. Potential Improvements:
   - Cache frequently used images
   - Add animation transitions
   - Implement retry mechanisms

## Notes for Junior Developers
1. Understanding the Flow:
   - Follow the error handling pattern
   - Notice the component separation
   - Study the image fallback system

2. Key Concepts:
   - React routing
   - Error handling
   - Image management
   - State management

3. Important Patterns:
   - Conditional rendering
   - Error boundaries
   - Navigation patterns
   - Image fallbacks

Thank you for your attention!