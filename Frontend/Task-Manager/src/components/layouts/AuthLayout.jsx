import React from 'react'
import LOGIN_SIGNUP_PAGE_IMAGE from '../../assets/images/image-signup-page-form-example.png'

const AuthLayout = ({ children }) => {
  return (
    <div className='flex'>
        <div className='w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12'>
            <h2 className='text-lg font-medium text-black'>Task Manager</h2>
            {children}
        </div>

        <div className='hidden md:flex w-[40vw] h-screen items-center justify-center bg-blue-50 bg-[url("/bg-img.png")] bg-cover bg-no-repeat bg-center overflow-hidden'>
            <img
              className="w-full h-full object-cover"
              src={LOGIN_SIGNUP_PAGE_IMAGE}
              alt="Auth Visual"
              loading='lazy'
            />
        </div>
    </div>
  );
}

export default AuthLayout

