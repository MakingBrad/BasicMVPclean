import useStore from '../../zustand/store'
import UserList from '../UserList/UserList';

function HomePage() {
  const user = useStore((state) => state.user);
  const logOut = useStore((state) => state.logOut);

  return (
    <>
      <h2>Home Page</h2>
      <p>Your username is: {user.username}</p>
      <p>Your ID is: {user.id}</p>
      <button onClick={logOut}>
        Log Out
      </button>
      <UserList/>
      
    </>
  );
}


export default HomePage;
