<script>
  import Button from './Button.svelte'
  import { createEventDispatcher } from 'svelte'

  export let book = {} // The book data is passed as a prop

  const dispatch = createEventDispatcher()

  const likeBook = () => {
    book.liked = !book.liked
  }

  const addToCart = () => {
    alert(`Added "${book.volumeInfo.title}" to cart!`)
  }

  const showSingleBook = () => {
    dispatch('showSingleBook', { id: book.id })
  }
</script>

<button
  class="bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
  on:click={showSingleBook}
  on:keydown={e => e.key === 'Enter' && showSingleBook()}
  aria-label={`Show details for ${book.volumeInfo.title}`}
>
  <div class="relative">
    <img
      class="w-full h-72 object-cover"
      src={book.volumeInfo.imageLinks?.thumbnail || ''}
      alt={book.volumeInfo.title}
    />
  </div>

  <!-- Book Details -->
  <div class="p-4">
    <h3 class="text-lg font-semibold text-gray-800 truncate">{book.volumeInfo.title}</h3>
    <p class="text-sm text-gray-600 max-w-[70%] truncate">{book.volumeInfo.authors?.join(', ')}</p>
    <p class="text-lg font-bold text-gray-900">
      ${(book.saleInfo?.listPrice?.amount || 10).toFixed(2)}
    </p>
  </div>

  <!-- Add to Cart Button -->
  <div class="flex justify-center items-center p-4">
    <Button on:click={addToCart}>Add to Cart</Button>
  </div>
</button>
