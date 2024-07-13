import { NavLink } from "react-router-dom";
import UsernameIcon from "../assets/username.svg";
const defaultNavStyle = "rounded-[32rem] py-2 px-6";
const activeNavStyle = "rounded-[32rem] py-2 px-6 bg-green-600";
const navTextStyle = "text-black font-normal text-base";
const navActiveTextStyle = "text-white font-normal text-base";
function Header() {
  return (
    <div
      id='header'
      className='flex justify-between px-4 py-2 bg-white border-l rounded-full items-center m-2 '
    >
      <div className='flex gap-8'>
        <h1 className='logo text-3xl text-green-600 font-semibold'>
          Epower OS
        </h1>
        <div className='rounded-full bg-green-50 flex'>
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
      <div className='flex justify-items-center gap-2 items-center'>
        <img src={UsernameIcon} alt='Username' />
        <p className='text-black text-base font-normal'>Username</p>
      </div>
    </div>
  );
}
export default Header;
