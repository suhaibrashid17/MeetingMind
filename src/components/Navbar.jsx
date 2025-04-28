import React from 'react'
import { useNavigate } from 'react-router-dom' 
const Navbar = () => {
    const navigate = useNavigate();
    const NPage = (route) =>{
           navigate(route)
    }
  return (
    <div className='flex flex-row items-center justify-between w-screen h-20 bg-black px-10'>
        <div>
            <h1 className='text-xl text-white'>
                MeetingMind
            </h1>
        </div>
        <div >
            <ul className='flex flex-row space-x-5'>
                <li className='text-white text-md hover:underline hover:opacity-75 hover:cursor-pointer' onClick={()=>NPage('/login')}>
                Login
                </li>
                <li className='text-white text-md hover:underline hover:opacity-75 hover:cursor-pointer' onClick={()=>NPage('/signup')}>
                Signup

                </li>
            </ul>
        </div>

    </div>
  )
}

export default Navbar