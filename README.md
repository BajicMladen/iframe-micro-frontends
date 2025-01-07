# Microfrontend E-Commerce Platform

This repository contains a microfrontend-based e-commerce application for selling books. The project uses a monorepo structure and includes three frontend applications, each built with a different framework. The apps communicate via `postMessage`, and the container application manages the overall data flow.

## Features
- **Container App (React):**
  - Provides a shared header and footer.
  - Acts as the controller for data flow between sibling applications.
  
- **Books List App (Svelte):**
  - Fetches and displays a list of programming books.
  - Allows users to select a book to view more details.

- **Single Book App (Vue):**
  - Displays details of a selected book.
  - Allows users to add the book to the cart.

### Demo
The application is live on Vercel:
[Microfrontend Bookstore](https://iframe-micro-frontends-container.vercel.app/)

### Design Inspiration
The UI design was inspired by the following Figma design:
[E-commerce Bookstore Design](https://figma.com/design/Dncxeu6U6eNgVMQM73LvTC/E-commerce-%7C-Website-design-%7C-Bookstore-(Community)?node-id=0-1&p=f&t=E27cPsNB1ucCzS3t-0)

---

## Project Structure
```
root/
├── apps/
│   ├── container/             # Container App (React)
│   ├── book-list/             # Books List App (Svelte)
│   ├── single-book/           # Single Book App (Vue)
├── shared                   
│   ├── .env                   # Global env file(Vite)
│   ├── communication.ts       # postMessage shared utils(TS)
```

## Communication Between Apps
The microfrontends communicate using the `postMessage` API:
- **Container App:** Listens for messages from sibling apps and routes data as needed/Directly sends messages to sibling apps.
- **Sibling Apps:** Send messages (e.g., book selection, cart updates) to the container app/Listens to messages from container app.

### Example: Sending a Message
```javascript
// Svelte App: Send selected book ID to the container
window.parent.postMessage({ type: 'SELECT_BOOK', bookId: 123 }, '*');
```

### Example: Receiving a Message
```javascript
// React Container: Listen for messages
window.addEventListener('message', (event) => {
  if (event.data.type === 'SELECT_BOOK') {
    const { bookId } = event.data;
    console.log(`Book selected: ${bookId}`);
  }
});
```

---

## Deployment
The app is deployed on [Vercel](https://vercel.com) with each microfrontend set up as a separate project.

### URLs
- **Container App:** [React Container](https://iframe-micro-frontends-container.vercel.app/)
- **Books List App:** Bottom section of the page - Book List.
- **Single Book App:** Top section of the page - Single Book.

---

## Local Development

### Prerequisites
- PNPM (preferred package manager)

### Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```
2. Install dependencies for each app:
   ```bash
   cd apps/container && pnpm install
   cd apps/single-book && pnpm install
   cd apps/book-list && pnpm install
   ```
3. Start development servers:
   ```bash
   # From the root, run each app in its directory
   cd apps/react-container && pnpm run dev
   cd ../svelte-books && pnpm run dev
   cd ../vue-single-book && pnpm run dev
   ```

### Environment Variables
Environment variables are shared across all apps using a single `.env` file in the /shared directory:
```env
VITE_CONTAINER_APP_URL=http://localhost:5173
VITE_BOOK_LIST_APP_URL=http://localhost:5174
VITE_SINGLE_BOOK_APP_URL=http://localhost:5175
```

---

## Contributing
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m "Add feature"`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

---

## License
This project is licensed under the [MIT License](LICENSE).
