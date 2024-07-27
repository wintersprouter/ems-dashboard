import { NavLink, useNavigate } from "react-router-dom";
import UsernameIcon from "../assets/username.svg";
import { AuthProvider } from "../context/authProvider";
const defaultNavStyle = "rounded-[32rem] py-2 px-6";
const activeNavStyle = "rounded-[32rem] py-2 px-6 bg-green-600";
const navTextStyle = "text-black font-normal text-base";
const navActiveTextStyle = "text-white font-normal text-base";
function Header() {
  const navigate = useNavigate();

  async function handleLogout() {
    await AuthProvider.signOut();
    return navigate("/dashboard/login");
  }

  return (
    <header
      id='header'
      className='flex flex-wrap justify-between px-5 py-3  bg-white border-l rounded-full items-center overflow-y-auto gap-4 z-40 min-w-max
      mt-2 container mx-auto
      lg:max-w-[calc(100%-1rem)]'
    >
      <div className='flex gap-8 items-center justify-between'>
        <h1 className='logo text-3xl text-green-600 font-semibold'>
          Epower OS
        </h1>
        <div className='rounded-full bg-green-50  hidden lg:flex lg:opacity-100'>
          <NavLink
            to={"/"}
            className={({ isActive, isPending }) =>
              isActive
                ? activeNavStyle
                : isPending
                ? defaultNavStyle
                : defaultNavStyle
            }
          >
            {({ isActive }) => (
              <p className={isActive ? navActiveTextStyle : navTextStyle}>
                Home
              </p>
            )}
          </NavLink>
          <NavLink
            to={"/dashboard"}
            className={({ isActive, isPending }) =>
              isActive
                ? activeNavStyle
                : isPending
                ? defaultNavStyle
                : defaultNavStyle
            }
          >
            {({ isActive }) => (
              <p className={isActive ? navActiveTextStyle : navTextStyle}>
                Data
              </p>
            )}
          </NavLink>
        </div>
      </div>
      {AuthProvider.isAuthenticated ? (
        <div className='flex gap-4 divide-x divide-gray-400 mr-2'>
          <button
            onClick={handleLogout}
            className='font-normal text-gray-800 text-sm'
          >
            Logout
          </button>
          <div className='flex gap-2 items-center'>
            <img src={UsernameIcon} alt='Username' className='ml-2' />
            <p className='text-gray-800 text-sm font-normal'>Username</p>
          </div>
        </div>
      ) : (
        <NavLink
          to={"/dashboard/login"}
          className='font-normal text-gray-800 text-sm mr-2'
        >
          <p>Login</p>
        </NavLink>
      )}
    </header>
  );
}
export default Header;
