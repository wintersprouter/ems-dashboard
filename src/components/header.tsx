function Header() {
  return (
    <div
      id='header'
      className='flex  justify-between px-4 py-2 bg-white border-l rounded-full items-center'
    >
      <div className='flex gap-8'>
        <h1 className='logo text-3xl text-green-600 font-semibold'>
          Epower OS
        </h1>
        <div className='rounded-full bg-green-50 flex'>
          <div className='rounded-[32px] py-2 px-6'>
            <p className='text-black font-normal text-base'>Home</p>
          </div>
          <div className='rounded-[32px] py-2 px-6 bg-green-600'>
            <p className='text-white font-normal text-base'>Data</p>
          </div>
        </div>
      </div>
      <div className='flex justify-items-center'>
        <img
          className='rounded-full bg-slate-600'
          alt='avatar'
          src='../../public/username.png'
        ></img>
        <p className='text-black text-base font-normal'>username</p>
      </div>
    </div>
  );
}
export default Header;
