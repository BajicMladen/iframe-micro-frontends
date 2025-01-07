import React, { useState } from 'react';
import logo from '../../assets/logo.png';
import logoText from '../../assets/logoText.png';
import Search from '../Search/Search';
import { FaShoppingCart, FaHeart, FaUser, FaPhoneAlt } from 'react-icons/fa';
import Button from '../Button/Button';
import CartDropdown from '../CartDropdown/CartDropdown';

const Header = ({ handleSearch, cart, onRemoveItem }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className='w-full flex flex-col justify-center items-center sticky top-0 z-50 bg-white'>
      <nav className='w-full border-b-2 border-purple-400 flex items-center justify-center min-h-16'>
        <div className='w-[80%] flex flex-row justify-between items-center'>
          <div className='flex flex-row items-center'>
            <img src={logo} alt='Company Logo' />
            <img src={logoText} alt='Company Name' />
          </div>
          <Search onSearch={handleSearch} />
          <div className='flex flex-row items-center gap-4 text-sm text-gray-400'>
            {['Privacy Policy', 'Warranty', 'Shipping', 'Returns'].map(
              (item) => (
                <div key={item} className='cursor-pointer'>
                  {item}
                </div>
              ),
            )}
          </div>
          <div className='flex flex-row items-center justify-center text-purple-400 gap-1 relative'>
            <div className='relative' onClick={toggleDropdown}>
              <FaShoppingCart className='cursor-pointer' />
              {cart.length > 0 && (
                <span className='absolute bottom-3 left-4 bg-purple-700 text-white rounded-full text-xs w-3 h-3 flex items-center justify-center'>
                  {cart.length}
                </span>
              )}
            </div>
            {isDropdownOpen && (
              <CartDropdown cart={cart} onRemoveItem={onRemoveItem} />
            )}
            <span className='mx-2'>|</span>
            <FaHeart className='cursor-pointer' />
            <span className='mx-2'>|</span>
            <FaUser className='cursor-pointer' />
          </div>
        </div>
      </nav>
      <section className='w-full border-b-2 border-purple-400 flex items-center justify-center min-h-16'>
        <div className='w-[80%] flex flex-row justify-between items-center'>
          <div className='flex flex-row items-center gap-4 text-gray-500'>
            {[
              'The Must Read',
              'News',
              'Publishers',
              'Promotion of the Month',
              'Subscribe to Newsletter',
            ].map((item) => (
              <div key={item} className='cursor-pointer'>
                {item}
              </div>
            ))}
          </div>
          <div className='flex flex-row items-center gap-6 text-purple-400'>
            <div className='flex flex-row items-center gap-1 cursor-pointer'>
              <FaPhoneAlt />
              <span className='text-gray-500'>+1 (234) 567-8901</span>
            </div>
            <Button variant='secondary'>Request a Call</Button>
          </div>
        </div>
      </section>
    </header>
  );
};

export default Header;
