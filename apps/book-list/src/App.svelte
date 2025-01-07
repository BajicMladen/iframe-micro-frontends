<script>
  import { onMount } from 'svelte'
  import { fetchBooks } from './api/api'
  import BookItem from './lib/components/BookItem.svelte'
  import { registerMessageListener, sendMessage } from '../../../shared/communication'

  let books = []
  let isLoading = true

  async function getBooksFromGoogleApi(query) {
    books = await fetchBooks(query)
    isLoading = false
  }

  function getAction(actionType) {
    const actions = {
      SEARCH_BOOK_LIST: getBooksFromGoogleApi,
    }
    return actions[actionType] || noop
  }

  function noop() {
    console.warn('Unsupported action type received.')
  }

  onMount(() => {
    const unregisterListener = registerMessageListener('COMMUNICATION', data => {
      debugger
      const action = getAction(data.action)
      action(data.payload)
    })

    ;(async () => {
      books = await fetchBooks('javascript')
      isLoading = false
    })()

    // Return cleanup function
    return unregisterListener
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
