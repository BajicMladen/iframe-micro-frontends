import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [filter, setFilter] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productList, setProductList] = useState([]);

    const allProducts = [
        { id: 1, name: "JavaScript: The Good Parts", category: "javascript" },
        { id: 2, name: "Eloquent JavaScript", category: "javascript" },
        { id: 3, name: "Learning Python", category: "python" },
        // Add more products here...
    ];

    // Event listener for messages from iframes
    useEffect(() => {
        const handleMessage = (event) => {
            const { type, data } = event.data;

            if (type === 'filter-change') {
                setFilter(data);
            } else if (type === 'product-select') {
                setSelectedProduct(data);
            }
        };

        window.addEventListener('message', handleMessage);

        return () => window.removeEventListener('message', handleMessage);
    }, []);

    // Update product list based on selected filter
    useEffect(() => {
        if (filter) {
            setProductList(allProducts.filter(product => product.category === filter));
        } else {
            setProductList(allProducts);  // Show all products if no filter is selected
        }
    }, [filter]);

    // Handle product click
    const handleProductClick = (product) => {
        setSelectedProduct(product);

        // Send selected product data to the Vue sidebar
        const sidebarFrame = document.getElementById('vue-sidebar');
        sidebarFrame.contentWindow.postMessage({ type: 'product-select', data: product }, '*');
    };

    return (
        <div className="App">
            {/* Embed Svelte header iframe */}
            <iframe
                src="http://localhost:3001"  // Port for the Svelte app
                title="Svelte Header"
                style={{ width: '100%', height: '80px', border: 'none' }}
            />

            {/* Main product list */}
            <div className="main-content">
                <h1>Product List</h1>
                <ul>
                    {productList.map((product) => (
                        <li
                            key={product.id}
                            onClick={() => handleProductClick(product)}
                            style={{ cursor: 'pointer', padding: '5px 0' }}
                        >
                            {product.name}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Embed Vue sidebar iframe */}
            <iframe
                src="http://localhost:3002"  // Port for the Vue app
                id="vue-sidebar"
                title="Vue Sidebar"
                style={{ width: '300px', height: '100%', border: 'none', position: 'absolute', right: 0, top: 0 }}
            />
        </div>
    );
}

export default App;
