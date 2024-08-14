import Navbar from "./navbar";

function Sidebar() {
  return (
    <aside
      id='default-sidebar'
      className='
      fixed top-36 lg:top-20 left-1 z-40 h-full rounded-2xl border border-white mx-2 shadow min-w-28 py-6 px-3 overflow-y-auto bg-gray-50 hidden lg:flex'
      aria-label='Sidebar'
    >
      <div className='grid grid-cols-1 divide-y-2 divide-gray-200 gap-6 h-full '>
        <Navbar />
      </div>
    </aside>
  );
}
export default Sidebar;
