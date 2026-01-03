<script>
  import { onMount, afterUpdate } from 'svelte'
  import { fetchBooks } from './api/api'
  import BookItem from './lib/components/BookItem.svelte'
  import { registerMessageListener, sendMessage, getAppOrigin } from '../../../shared/communication'
  import { MESSAGE_ACTIONS, MESSAGE_TYPE } from '../../../shared/types'
  import { API_CONFIG, FRAME_NAMES } from '../../../shared/config'
  import { setupAutoResize } from '../../../shared/utils'

  let books = []
  let isLoading = true
  let error = null
  let cleanupResize = null

  async function getBooksFromGoogleApi(query) {
    try {
      isLoading = true
      books = await fetchBooks(query)
    } catch (err) {
      error = 'Failed to fetch books'
      console.error(err)
    } finally {
      isLoading = false
    }
  }

  function getAction(actionType) {
    const actions = {
      [MESSAGE_ACTIONS.SEARCH_BOOK_LIST]: getBooksFromGoogleApi,
    }
    return actions[actionType] || noop
  }

  function noop() {
    console.warn('Unsupported action type received.')
  }

  onMount(() => {
    const unregisterListener = registerMessageListener(MESSAGE_TYPE, data => {
      const action = getAction(data.action)
      if (data.action === MESSAGE_ACTIONS.SEARCH_BOOK_LIST) {
        action(data.payload.query)
      } else {
        action(data.payload)
      }
    })

    // Setup auto-resize
    cleanupResize = setupAutoResize(FRAME_NAMES.BOOK_LIST)

    ;(async () => {
      await getBooksFromGoogleApi(API_CONFIG.DEFAULT_SEARCH_QUERY)
    })()

    return () => {
      unregisterListener()
      if (cleanupResize) cleanupResize()
    }
  })

  afterUpdate(() => {
    // Send height update after content changes
    sendMessage(window.parent, getAppOrigin('container'), MESSAGE_TYPE, {
      action: MESSAGE_ACTIONS.RESIZE_IFRAME,
      payload: { height: document.body.scrollHeight, frameName: FRAME_NAMES.BOOK_LIST },
    })
  })

  const showSingleBook = e => {
    sendMessage(window.parent, getAppOrigin('container'), MESSAGE_TYPE, {
      action: MESSAGE_ACTIONS.SHOW_SINGLE_BOOK,
      payload: { bookId: e.detail.id },
    })
  }
</script>

<div class="flex w-full overflow-hidden h-full items-center justify-center">
  {#if isLoading}
    <p class="text-center text-lg">Loading books...</p>
  {:else if error}
    <p class="text-center text-lg text-red-500">{error}</p>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 p-4 w-4/5">
      {#each books as book}
        <BookItem {book} on:showSingleBook={showSingleBook} />
      {/each}
    </div>
  {/if}
</div>
