<template>
  <div class="flex w-full overflow-hidden h-full items-center justify-center">
    <div class="flex gap-8 p-8 w-4/5">
      <!-- Left Column: Thumbnails -->
      <div class="flex flex-col gap-4 w-20">
        <div
          v-for="(image, index) in book.images"
          :key="index"
          class="cursor-pointer border-2 border-transparent hover:border-gray-300"
          @click="setMainImage(image)"
        >
          <img :src="image" :alt="`Thumbnail ${index + 1}`" class="w-full" />
        </div>
      </div>

      <!-- Center Column: Main Image -->
      <div class="flex justify-center">
        <img
          :src="mainImage"
          alt="Main Book Cover"
          class="w-64 object-contain"
        />
      </div>

      <!-- Right Column: Book Details -->
      <div class="flex flex-col gap-6 flex-1">
        <div class="text-2xl font-bold">{{ book.title }}</div>
        <div class="text-md text-gray-400">By {{ book.author }}</div>

        <!-- Rating -->
        <!-- <div class="flex items-center gap-2">
          <span
            v-for="star in 5"
            :key="star"
            class="text-xl"
            :class="{
              'text-yellow-500': star <= book.rating,
              'text-gray-300': star > book.rating,
            }"
          >
            ★
          </span>
          <span class="text-gray-600">{{ book.rating }}</span>
        </div> -->

        <!-- Price -->
        <div class="text-xl font-semibold">${{ book.price }}</div>

        <!-- Description -->
        <div class="text-gray-600">{{ book.description }}</div>

        <!-- Quantity Selector -->
        <div class="flex flex-row items-center gap-6">
          <div class="flex items-center gap-4">
            <label for="quantity" class="text-gray-700">Quantity:</label>
            <input
              type="number"
              id="quantity"
              v-model.number="quantity"
              min="1"
              class="w-16 p-2 border border-gray-300"
            />
          </div>

          <!-- Actions -->
          <div class="flex gap-4">
            <button
              class="px-4 py-2 bg-purple-400 text-white hover:bg-purple-600"
              @click="addToCart"
            >
              Add to cart
            </button>
            <button class="px-4 py-2 border border-gray-300 hover:bg-gray-100">
              Favorite
            </button>
          </div>
        </div>
        <!-- Additional Info -->
        <div class="text-sm text-gray-600 flex flex-row gap-6">
          <div>
            <strong class="text-purple-400">Publisher:</strong>
            {{ book.publisher }}
          </div>
          <div>
            <strong class="text-purple-400">Publication Date:</strong>
            {{ book.publicationDate }}
          </div>
          <div>
            <strong class="text-purple-400">Language:</strong>
            {{ book.language }}
          </div>
          <div>
            <strong class="text-purple-400">Length:</strong>
            {{ book.pageCount }} pages
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      book: {
        title: '',
        author: '',
        rating: 0,
        price: 0,
        description: '',
        publisher: '',
        publicationDate: '',
        language: '',
        pageCount: 0,
        images: [],
      },
      mainImage: '',
      quantity: 1,
    };
  },
  methods: {
    parseHTMLtoText(htmlString) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');
      return doc.body.textContent.trim();
    },

    async fetchBookDetails(bookId) {
      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${bookId}`
        );
        const data = await response.json();
        const volumeInfo = data.volumeInfo;

        this.book = {
          title: volumeInfo.title,
          author: volumeInfo.authors?.join(', ') || 'Unknown Author',
          rating: volumeInfo.averageRating || 0,
          price: (data.saleInfo?.listPrice?.amount || 12.49).toFixed(2), // Default price fallback
          description:
            this.parseHTMLtoText(volumeInfo.description)
              .substring(0, 500)
              .concat('...') || 'No description available.',
          publisher: volumeInfo.publisher || 'Unknown Publisher',
          publicationDate: volumeInfo.publishedDate || 'Unknown Date',
          language: volumeInfo.language || 'Unknown Language',
          pageCount: volumeInfo.pageCount || 'N/A',
          images: [
            volumeInfo.imageLinks?.thumbnail ||
              'https://via.placeholder.com/150',
            volumeInfo.imageLinks?.smallThumbnail ||
              'https://via.placeholder.com/150',
          ],
        };
        this.mainImage = this.book.images[0];
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    },
    setMainImage(image) {
      this.mainImage = image;
    },
    addToCart() {
      alert(
        `Added ${this.quantity} copies of "${this.book.title}" to your cart!`
      );
    },
  },
  mounted() {
    // Replace "BOOK_ID" with the actual Google Books ID of the book you want to fetch
    const bookId = 'n_xTEAAAQBAJ';
    this.fetchBookDetails(bookId);
  },
};
</script>
