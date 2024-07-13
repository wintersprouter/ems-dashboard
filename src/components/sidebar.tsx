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
  "p-2 text-base text-gray-800 font-normal hover:text-green-800 ";
const navActiveTextStyle = "p-2 text-base text-green-800 font-normal";

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
    navigation: "/dashboard/monitoring-point",
    name: "Monitoring Point",
    icon: monitoring_point_icon,
    activeIcon: monitoring_point_active_icon,
  },
];

function Sidebar() {
  return (
    <div
      id='sidebar'
      className='mb-4 rounded-2xl bg-gray-50 py-6 px-3 border border-white  marker flex-shrink mx-2 shadow h-[60rem] min-w-fit'
    >
      <div className='grid grid-cols-1 divide-y-2 divide-gray-200 gap-6'>
        <nav className='pb-4'>
          <h2 className='text-left text-xs text-gray-400'>General</h2>
          <ul className='flex flex-col gap-3 my-3'>
            {navigation.map((item, idx) => (
              <NavLink to={item.navigation}>
                {({ isActive, isPending }) => (
                  <li
                    key={idx}
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
      </div>
    </div>
  );
}
export default Sidebar;
