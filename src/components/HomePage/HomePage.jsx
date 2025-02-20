import useStore from '../../zustand/store'
import UserList from '../UserList/UserList';
import DesignList from '../DesignList/DesignList';

function HomePage() {
  const user = useStore((state) => state.user);
  const logOut = useStore((state) => state.logOut);

  return (
    <>
      <h2>Home Page</h2>
      <p>Your username is: {user.username}</p>
      <p>Your ID is: {user.id}</p>
      {/* show admin functions if user is admin */}
      {user.user_is_admin ?(
                <p>You have admin privileges - use them wisely.
                </p>
              ):(null)}
      
            
      <button onClick={logOut}>
        Log Out
      </button>
      <DesignList/>

      <UserList/>
      
    </>
  );
}


export default HomePage;
