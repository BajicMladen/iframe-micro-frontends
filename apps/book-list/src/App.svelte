<script>
  import { onMount } from 'svelte'
  import { fetchBooks } from './api/api'
  import BookItem from './lib/components/BookItem.svelte'
  import { sendMessage } from '../../../shared/communication'

  let books = []
  let isLoading = true

  onMount(async () => {
    books = await fetchBooks('javascript')
    isLoading = false
  })

  const showSingleBook = e => {
    sendMessage(window.parent, 'http://localhost:5173', 'COMMUNICATION', {
      action: 'SHOW_SINGLE_BOOK',
      payload: e.detail.id,
    })
  }
</script>

<div class="flex w-full overflow-hidden h-full items-center justify-center">
  {#if isLoading}
    <p class="text-center text-lg">Loading books...</p>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 p-4 w-4/5">
      {#each books as book}
        <BookItem {book} on:showSingleBook={showSingleBook} />
      {/each}
    </div>
  {/if}
</div>
