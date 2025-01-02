import React from 'react';
import logo from '../../assets/logo.png';
import logoText from '../../assets/logoText.png';
import Search from '../Search/Search';
import { FaShoppingCart, FaHeart, FaUser, FaPhoneAlt } from 'react-icons/fa';
import Button from '../Button/Button';

const Header = () => {
  return (
    <div className='w-full flex flex-col justify-center items-center'>
      <div className='w-full border-b-2 border-purple-400 flex items-center justify-center min-h-16'>
        <div className='w-[80%] flex flex-row justify-between items-center'>
          <div className='flex flex-row items-center'>
            <img src={logo} alt='Logo' />
            <img src={logoText} alt='Logo' />
          </div>
          <Search onSearch={(value) => console.log(value)}></Search>
          <div className='flex flex-row items-center gap-4 text-sm text-gray-400'>
            <div className='cursor-pointer'>Privacy Policy</div>
            <div className='cursor-pointer'>Warranty</div>
            <div className='cursor-pointer'>Shipping</div>
            <div className='cursor-pointer'>Returns</div>
          </div>
          <div>
            <div className='flex flex-row items-center justify-center text-purple-400 gap-1'>
              <FaShoppingCart className='cursor-pointer' />
              <span className='mx-2'>|</span>
              <FaHeart className=' cursor-pointer' />
              <span className='mx-2'>|</span>
              <FaUser className='cursor-pointer' />
            </div>
          </div>
        </div>
      </div>
      <div className='w-full border-b-2 border-purple-400 flex items-center justify-center min-h-16'>
        <div className='w-[80%] flex flex-row justify-between items-center'>
          <div className='flex flex-row items-center gap-4 text-gray-500'>
            <div className='cursor-pointer'>The Must Read</div>
            <div className='cursor-pointer'>News</div>
            <div className='cursor-pointer'>Publishers</div>
            <div className='cursor-pointer'>Promotion of the Month</div>
            <div className='cursor-pointer'>Subscribe to Newsletter</div>
          </div>
          <div className='flex flex-row items-center gap-6 text-purple-400'>
            <div className='flex flex-row items-center gap-1 cursor-pointer'>
              <FaPhoneAlt />
              <span className='text-gray-500'>+1 (234) 567-8901</span>
            </div>
            <Button variant='secondary'>Request a Call</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
