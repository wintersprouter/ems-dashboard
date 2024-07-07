function Header() {
  return (
    <div
      id='header'
      className='flex-grow flex h-20 justify-between align-middle max-w-full px-4 py-2 m-4'
    >
      <div>
        <div className='flex-col'>
          <p className='text-gray-500 text-xs'>2024 / 07 / 01 WED</p>
          <p className='text-gray-800 text font-medium'>H:28°C / L:20°C</p>
        </div>
      </div>
      <div className='flex justify-items-center'>
        {/* <img className='rounded-full bg-slate-600' alt='avatar'></img> */}
        <p className='text-black text font-normal'>username</p>
      </div>
    </div>
  );
}
export default Header;
