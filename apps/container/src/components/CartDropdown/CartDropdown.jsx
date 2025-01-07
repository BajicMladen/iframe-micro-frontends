import { FaTrash } from 'react-icons/fa';

const CartDropdown = ({ cart, onRemoveItem }) => {
  return (
    <div className='absolute right-10 top-4 mt-2 bg-white border border-gray-300 shadow-lg w-80 max-h-60 overflow-y-auto z-10'>
      <div className='p-4 text-center text-gray-600 font-bold'>Your Cart</div>
      {cart.length === 0 ? (
        <div className='p-4 text-gray-500'>Your cart is empty.</div>
      ) : (
        cart.map((item, index) => (
          <div
            key={index}
            className='flex items-center justify-between p-3 border-b border-gray-200'
          >
            <img
              src={item.image}
              alt={item.title}
              className='w-12 h-12 object-cover'
            />
            <div className='flex-1 ml-4 text-gray-700'>
              <div className='font-semibold'>{item.title}</div>
              <div className='text-sm'>Quantity: {item.quantity}</div>
            </div>
            <button
              onClick={() => onRemoveItem(item.bookId)}
              className='text-red-500 hover:text-red-700'
            >
              <FaTrash />
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default CartDropdown;
