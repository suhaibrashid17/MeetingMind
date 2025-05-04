import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Logout, selectLoggedinUser } from '../auth/authSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch  = useDispatch();
  const NPage = (route) => {
    navigate(route);
  };
  const user = useSelector(selectLoggedinUser);

  return (
    <div className='fixed top-0 left-0 w-full h-20 bg-black px-4 md:px-10 z-20 flex flex-row items-center justify-between'>
      <div>
        <h1 className='text-lg md:text-xl text-white'>
          MeetingMind
        </h1>
      </div>
      {!user && (
        <div>
          <ul className='flex flex-row space-x-3 md:space-x-5'>
            <li
              className='text-white text-sm md:text-md hover:underline hover:opacity-75 hover:cursor-pointer'
              onClick={() => NPage('/login')}
            >
              Login
            </li>
            <li
              className='text-white text-sm md:text-md hover:underline hover:opacity-75 hover:cursor-pointer'
              onClick={() => NPage('/signup')}
            >
              Signup
            </li>
          </ul>
        </div>
      )}
      {
        user&&(
          <p
          className='text-white text-sm md:text-md hover:underline hover:opacity-75 hover:cursor-pointer'
          onClick={() => {dispatch(Logout()); NPage("/");}}
        >
          Logout
        </p>
        )
      }
    </div>
  );
};

export default Navbar;