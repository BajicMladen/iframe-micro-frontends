import { FaTrash } from 'react-icons/fa';

type Book = {
  id: string;
  title: string;
  thumbnail: string;
  price?: number;
};

type CartItem = {
  book: Book;
  quantity: number;
};

type CartDropdownProps = {
  cart: CartItem[];
  onRemoveItem: (bookId: string) => void;
};

const CartDropdown = ({ cart, onRemoveItem }: CartDropdownProps) => {
  return (
    <div className='absolute right-10 top-4 mt-2 bg-white border border-gray-300 shadow-lg w-80 max-h-80 overflow-y-auto z-10'>
      <div className='p-4 text-center text-gray-600 font-bold'>Your Cart</div>
      {cart?.length === 0 ? (
        <div className='p-4 text-gray-500'>Your cart is empty.</div>
      ) : (
        cart.map((item, index) => (
          <div
            key={item.book.id || index}
            className='flex items-center justify-between p-3 border-b border-gray-200'
          >
            <img
              src={item.book.thumbnail}
              alt={item.book.title}
              className='w-12 h-12 object-cover'
            />
            <div className='flex-1 ml-4 text-gray-700'>
              <div className='font-semibold'>{item.book.title}</div>
              <div className='text-sm'>Quantity: {item.quantity}</div>
              <div className='text-sm font-bold'>
                ${item.book.price?.toFixed(2)}
              </div>
            </div>
            <button
              onClick={() => onRemoveItem(item.book.id)}
              className='text-red-500 hover:text-red-700'
              type='button'
              title='Remove from cart'
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
