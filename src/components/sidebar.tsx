function Sidebar() {
  return (
    <div
      id='sidebar'
      className='m-4 rounded-2xl bg-gray-50 py-6 px-3 border border-white flex-shrink'
    >
      <div className='grid grid-cols-1 divide-y-2 divide-gray-200 gap-6 '>
        <div className='justify-center'>
          <h1 className='text-center text-3xl'>EMS</h1>
          <h1>智慧電能管理系統</h1>
        </div>
        <nav className='py-4'>
          <h2 className='text-left text-xs text-gray-400'>General</h2>
          <ul className='flex-col'>
            <li>
              <a href='#'>Overview</a>
            </li>
            <li>
              <a href='#'>Stations</a>
            </li>
            <li>
              <a href='#'>Monitoring Point</a>
            </li>
            <li>
              <a href='#'>Control Unit</a>
            </li>
          </ul>
        </nav>
        <div className='py-4'>
          <h2 className='text-left text-xs text-gray-400'>Other</h2>
          <div>Setting</div>
        </div>
      </div>
    </div>
  );
}
export default Sidebar;
