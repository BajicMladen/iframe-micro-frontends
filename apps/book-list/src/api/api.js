export const fetchBooks = async (query = 'programming') => {
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=8`)
  const data = await res.json()
  return data.items || []
}
