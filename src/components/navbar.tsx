import { format } from "date-fns/format";
import { NavLink } from "react-router-dom";
import monitoring_point_active_icon from "../assets/monitoring_point_active_icon.svg";
import monitoring_point_icon from "../assets/monitoring_point_icon.svg";
import overview_active_icon from "../assets/overview_active_icon.svg";
import overview_icon from "../assets/overview_icon.svg";
import tree_active_icon from "../assets/tree_active_icon.svg";
import tree_icon from "../assets/tree_icon.svg";
const navLinkStyle =
  "flex px-1 pl-2 hover:bg-green-100 hover:rounded duration-150 ease-in-out";
const activeNavLinkStyle =
  "flex px-1  rounded bg-green-100 border-green-400 border duration-150 ease-in-out";

const navTextStyle =
  "p-2 text-base text-gray-800 font-normal hover:text-green-800 hidden lg:flex ";
const navActiveTextStyle =
  "p-2 text-base text-green-800 font-normal hidden lg:flex ";

const navigation = [
  {
    navigation: "/dashboard/overview",
    name: "Overview",
    icon: overview_icon,
    activeIcon: overview_active_icon,
  },

  {
    navigation: "/dashboard/tree",
    name: "Tree",
    icon: tree_icon,
    activeIcon: tree_active_icon,
  },
  {
    navigation: `/dashboard/monitoring-point?deviceId=0&startDate=${format(
      new Date(),
      "yyyy-MM-dd"
    )}`,
    name: "Monitoring Point",
    icon: monitoring_point_icon,
    activeIcon: monitoring_point_active_icon,
  },
];
const Navbar = () => {
  return (
    <nav className='pb-4'>
      <h2 className='text-left text-xs text-gray-400'>General</h2>
      <ul className='flex flex-col gap-3 my-3'>
        {navigation.map((item, idx) => (
          <NavLink key={`NavLink-${idx}`} to={item.navigation}>
            {({ isActive, isPending }) => (
              <li
                className={
                  isActive
                    ? activeNavLinkStyle
                    : isPending
                    ? navLinkStyle
                    : navLinkStyle
                }
              >
                {isActive && (
                  <div className='relative right-4 top-0 h-10 w-1 bg-green-800' />
                )}
                <img
                  src={isActive ? item.activeIcon : item.icon}
                  alt={item.navigation}
                />
                <p className={isActive ? navActiveTextStyle : navTextStyle}>
                  {item.name}
                </p>
              </li>
            )}
          </NavLink>
        ))}
      </ul>
    </nav>
  );
};
export default Navbar;
