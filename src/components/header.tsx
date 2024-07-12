function Header() {
  return (
    <div
      id='header'
      className='flex h-20 justify-between align-middle px-4 py-2'
    >
      <h1 className='logo text-3xl text-green-600 font-semibold'>Epower OS</h1>
      <div></div>
      <div className='flex justify-items-center'>
        {/* <img className='rounded-full bg-slate-600' alt='avatar'></img> */}
        <p className='text-black text font-normal'>username</p>
      </div>
    </div>
  );
}
export default Header;
