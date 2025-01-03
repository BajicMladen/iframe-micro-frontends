<script>
  import { onMount } from 'svelte'
  import { fetchBooks } from './api/api'
  import BookItem from './lib/components/BookItem.svelte' // Import the BookItem component

  let books = []
  let isLoading = true

  onMount(async () => {
    books = await fetchBooks('programming') // You can change the query here
    isLoading = false
  })
</script>

<div class=" flex w-full overflow-hidden h-full items-center justify-center">
  {#if isLoading}
    <p class="text-center text-lg">Loading books...</p>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 p-4 w-4/5">
      {#each books as book}
        <BookItem {book} /> <!-- Use BookItem component for each book -->
      {/each}
    </div>
  {/if}
</div>
