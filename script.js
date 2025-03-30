// Load products when the page loads
document.addEventListener('DOMContentLoaded', loadProducts);

// Open the Add Product modal
function openAddModal() {
    document.getElementById('addModal').style.display = 'block';
}

// Close the Add Product modal
function closeAddModal() {
    document.getElementById('addModal').style.display = 'none';
}

// Handle form submission for adding a product
document.getElementById('addProductForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);

    fetch('add_product.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('Product added successfully!');
            closeAddModal();
            loadProducts(); // Reload the product list
            this.reset(); // Reset the form
        } else {
            alert('Error adding product: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while adding the product: ' + error.message);
    });
});

// Load products from the database
function loadProducts() {
    fetch('get_products.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const productList = document.getElementById('product-list');
            productList.innerHTML = ''; // Clear the table

            data.forEach((product, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${product.item_name}</td>
                    <td>${product.item_cost}</td>
                    <td>${product.description}</td>
                    <td>${product.quantity}</td>
                    <td>${product.available}</td>
                    <td><button>Issue Item</button></td>
                `;
                productList.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while loading products: ' + error.message);
        });
}