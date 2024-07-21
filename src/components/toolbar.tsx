import { useState } from "react";

const ToolBar = () => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleStartTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newStartTime: string = event.target.value;
    setStartTime(newStartTime);
    if (newStartTime > endTime) {
      setEndTime(newStartTime);
    }
  };

  const handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndTime(event.target.value);
  };

  return (
    <section
      className='relative top-36 lg:top-4 lg:left-48 bg-white rounded-2xl gap-4 p-4 pl-8 flex flex-col divide-y-[1px] divide-gray-300  max-w-72 h-[42rem]
    '
    >
      <div className='grid grid-cols-2 gap-1'>
        <button
          type='button'
          className='rounded-lg border border-gray-300 p-2 text-xs text-gray-400 font-normal active:text-white active:bg-green-600 active:border-green-700'
        >
          CH Name
        </button>
        <button
          type='button'
          className='rounded-lg border  p-2 text-xs text-gray-400 font-normal active:text-white active:bg-green-600 active:border-green-700'
        >
          CH Name
        </button>
        <button
          type='button'
          className='rounded-lg border border-gray-300 p-2 text-xs text-gray-400 font-normal active:text-white active:bg-green-600 active:border-green-700'
        >
          CH Name
        </button>
        <button
          type='button'
          className='rounded-lg border  p-2 text-xs text-gray-400 font-normal active:text-white active:bg-green-600 active:border-green-700'
        >
          CH Name
        </button>
        <button
          type='button'
          className='rounded-lg border border-gray-300 p-2 text-xs text-gray-400 font-normal active:text-white active:bg-green-600 active:border-green-700'
        >
          CH Name
        </button>
        <button
          type='button'
          className='rounded-lg border  p-2 text-xs text-gray-400 font-normal active:text-white active:bg-green-600 active:border-green-700'
        >
          CH Name
        </button>
        <button
          type='button'
          className='rounded-lg border border-gray-300 p-2 text-xs text-gray-400 font-normal active:text-white active:bg-green-600 active:border-green-700'
        >
          CH Name
        </button>
        <button
          type='button'
          className='rounded-lg border  p-2 text-xs text-gray-400 font-normal active:text-white active:bg-green-600 active:border-green-700'
        >
          CH Name
        </button>
      </div>
      <div>
        <h4 className='my-4 font-medium text-gray-800'>Date Range</h4>
        <input
          aria-label='Date and time from'
          value={startTime}
          onChange={handleStartTimeChange}
          type='datetime-local'
        />
        <input
          aria-label='Date and time to'
          min={startTime}
          value={endTime}
          onChange={handleEndTimeChange}
          type='datetime-local'
        />
      </div>
      <div>
        <h4 className='my-4 font-medium text-gray-800'>Introduction</h4>
        <div className='flex gap-3 mb-2'>
          <div>
            <p className='text-sm text-gray-800'>Built Time</p>
            <p className='text-sm text-gray-800'>Side</p>
            <p className='text-sm text-gray-800'>CT</p>
          </div>
          <div>
            <p className='text-sm text-gray-800'>2024/9</p>
            <p className='text-sm text-gray-800'>S</p>
            <p className='text-sm text-gray-800'>A</p>
          </div>
        </div>
        <div>
          <h5 className='text-gray-400 text-sm'>Note</h5>
          <p className='text-sm text-gray-800'>
            Learn how ingsist.com uses colors and fonts to enhance user
            experience and design coherence.
          </p>
        </div>
      </div>
    </section>
  );
};
export default ToolBar;
