<template>
  <div class="flex w-full h-full items-center justify-center mt-4">
    <!-- Placeholder View -->
    <div
      v-if="!book.title"
      class="flex flex-col items-center justify-center gap-4 p-8 w-4/5 text-center bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg"
    >
      <h1 class="text-4xl font-bold">Welcome to B-World!</h1>
      <p class="text-lg">
        Check out our latest collection of books. Here's a featured title for
        you!
      </p>
      <div class="flex flex-col md:flex-row gap-6 items-center">
        <!-- Featured Book -->
        <div class="flex flex-col items-center w-4/5">
          <img
            :src="artOfCoding"
            alt="Featured Book Cover"
            class="w-52 h-68 object-cover rounded-lg shadow-md"
          />
          <h2 class="text-2xl font-semibold mt-4">The Art of Coding</h2>
          <p class="text-sm">
            Mohammad Majid al-Rifaie, Anna Ursyn, Theodor Wyeld
          </p>
        </div>
        <div class="flex flex-col text-left">
          <p class="text-xl font-medium">Price: $24.99</p>
          <p class="">
            Discover the secrets to becoming a coding expert. This book offers
            insights and practical advice for all levels, whether you're a
            beginner just starting your programming journey or an experienced
            developer looking to refine your skills. Dive into real-world
            examples, step-by-step tutorials, and expert tips that will guide
            you through mastering key concepts, writing clean code, and solving
            complex problems efficiently
          </p>
        </div>
      </div>
    </div>

    <!-- Book Details View -->
    <div v-else class="flex gap-8 p-8 w-4/5">
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
        <div class="text-xl font-semibold">${{ book.price }}</div>
        <div class="text-gray-600">{{ book.description }}</div>
        <div class="flex items-center gap-6">
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
          <div class="flex gap-4 w-2/5">
            <Button @handleClick="addToCart" :variant="'primary'"
              >Add to cart</Button
            >
          </div>
        </div>
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
import Button from './components/Button.vue';
import artOfCoding from './assets/artOfCoding.jpg';
import {
  registerMessageListener,
  sendMessage,
} from '../../../shared/communication';

export default {
  components: {
    Button,
  },
  data() {
    return {
      artOfCoding,
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
          id: data.id,
          title: volumeInfo.title,
          author: volumeInfo.authors?.join(', ') || 'Unknown Author',
          rating: volumeInfo.averageRating || 0,
          price: (data.saleInfo?.listPrice?.amount || 12.49).toFixed(2),
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
        this.quantity = 1;
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    },
    setMainImage(image) {
      this.mainImage = image;
    },
    addToCart() {
      sendMessage(
        window.parent,
        import.meta.env.VITE_CONTAINER_APP_URL,
        'COMMUNICATION',
        {
          action: 'ADD_TO_CART',
          payload: {
            title: this.book.title,
            image: this.book.images[0],
            bookId: this.book.id,
            quantity: this.quantity,
          },
        }
      );
    },
    getAction(actionType) {
      const actions = {
        SHOW_SINGLE_BOOK: this.fetchBookDetails,
      };
      return actions[actionType] || this.noop;
    },
    noop() {
      console.warn('Unsupported action type received.');
    },
  },
  mounted() {
    this.unregisterListener = registerMessageListener(
      'COMMUNICATION',
      (data) => {
        const action = this.getAction(data.action);
        action(data.payload);
      }
    );
  },
  beforeDestroy() {
    // Clean up the listener on component destroy
    if (this.unregisterListener) {
      this.unregisterListener();
    }
  },
};
</script>
