import useStore from '../../zustand/store'
import UserList from '../UserList/UserList';
import DesignList from '../DesignList/DesignList';
import SingleUserDesigns from '../SingleUserDesigns/SingleUserDesigns';

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
      {user.user_is_admin ?(
                <DesignList/>
              ):(<SingleUserDesigns/>)}
      {/* <h1>this is a list of the "all design list"</h1>
      <DesignList/>
      <h1>this "ties to" the singleUserDesigns</h1>
      <SingleUserDesigns/> */}
      <h1>This is the list of the users</h1>
      <UserList/>
      
    </>
  );
}


export default HomePage;
