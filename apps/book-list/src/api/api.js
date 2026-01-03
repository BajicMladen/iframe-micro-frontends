import { SimpleCache, retryWithBackoff } from '../../../../shared/utils'
import { API_CONFIG, CACHE_CONFIG } from '../../../../shared/config'
import { sanitizeInput } from '../../../../shared/sanitization'

// Create a cache instance for API responses
const booksCache = new SimpleCache(CACHE_CONFIG.MAX_CACHE_SIZE)

export const fetchBooks = async query => {
  // Sanitize the search query
  const sanitizedQuery = sanitizeInput(query || API_CONFIG.DEFAULT_SEARCH_QUERY)
  const queryString = sanitizedQuery || 'programming'

  // Check cache first
  if (CACHE_CONFIG.ENABLE_CACHE) {
    const cachedData = booksCache.get(queryString)
    if (cachedData) {
      console.log('Returning cached data for:', queryString)
      return cachedData
    }
  }

  // Fetch with retry logic
  const fetchWithRetry = async () => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.REQUEST_TIMEOUT)

    try {
      const res = await fetch(
        `${API_CONFIG.GOOGLE_BOOKS_BASE_URL}?q=${encodeURIComponent(queryString)}&maxResults=${API_CONFIG.MAX_RESULTS}`,
        { signal: controller.signal }
      )

      clearTimeout(timeoutId)

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      }

      const data = await res.json()
      return data.items || []
    } catch (error) {
      clearTimeout(timeoutId)
      if (error.name === 'AbortError') {
        throw new Error('Request timeout')
      }
      throw error
    }
  }

  try {
    const books = await retryWithBackoff(fetchWithRetry, API_CONFIG.MAX_RETRIES, API_CONFIG.RETRY_DELAY)

    // Cache the successful response
    if (CACHE_CONFIG.ENABLE_CACHE && books.length > 0) {
      booksCache.set(queryString, books, CACHE_CONFIG.CACHE_DURATION)
    }

    return books
  } catch (error) {
    console.error('Failed to fetch books after retries:', error)
    throw error
  }
}

// Export cache instance for testing/debugging
export const getCacheInstance = () => booksCache
