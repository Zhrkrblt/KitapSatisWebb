// Örnek kitap verileri
const books = [
    {
        id: 1,
        title: "1984",
        author: "George Orwell",
        price: 45.90,
        image: "https://picsum.photos/200/300?random=1",
        category: "Roman"
    },
    {
        id: 2,
        title: "Dune",
        author: "Frank Herbert",
        price: 65.50,
        image: "https://picsum.photos/200/300?random=2",
        category: "Bilim Kurgu"
    },
    {
        id: 3,
        title: "Sapiens",
        author: "Yuval Noah Harari",
        price: 75.90,
        image: "https://picsum.photos/200/300?random=3",
        category: "Tarih"
    },
    {
        id: 4,
        title: "Atomic Habits",
        author: "James Clear",
        price: 55.90,
        image: "https://picsum.photos/200/300?random=4",
        category: "Kişisel Gelişim"
    },
    {
        id: 5,
        title: "Suç ve Ceza",
        author: "Fyodor Dostoyevski",
        price: 89.90,
        image: "https://picsum.photos/200/300?random=5",
        category: "Roman"
    },
    {
        id: 6,
        title: "Yüzüklerin Efendisi",
        author: "J.R.R. Tolkien",
        price: 129.90,
        image: "https://picsum.photos/200/300?random=6",
        category: "Bilim Kurgu"
    }
];

console.log('Books array loaded:', books);

// Sepet işlemleri
let cart = [];
let favorites = [];

// Kitapları görüntüle
function displayBooks(filteredBooks = books) {
    console.log('Displaying books:', filteredBooks);
    const container = document.getElementById('bookContainer');
    if (!container) {
        console.error('Book container not found!');
        return;
    }

    try {
        container.innerHTML = '';
        filteredBooks.forEach(book => {
            const bookCard = createBookCard(book);
            if (bookCard) {
                container.appendChild(bookCard);
            }
        });
        console.log('Books displayed successfully. Total books:', filteredBooks.length);
    } catch (error) {
        console.error('Error displaying books:', error);
    }
}

// Olay dinleyicilerini ayarla
function setupEventListeners() {
    // Kategori butonları için olay dinleyicileri
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterBooks(button.textContent);
        });
    });

    // Login formu için olay dinleyicisi
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Ödeme formu için olay dinleyicisi
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', handlePayment);
    }
}

// Kitap kartı oluştur
function createBookCard(book) {
    console.log('Creating book card for:', book);
    
    if (!book) {
        console.error('Invalid book data');
        return null;
    }

    try {
        const div = document.createElement('div');
        div.className = 'book-card';
        div.innerHTML = `
            <img src="${book.image}" alt="${book.title}" class="book-image" onerror="this.src='https://via.placeholder.com/200x300?text=Kitap+Kapağı'">
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">${book.author}</p>
                <p class="book-price">${book.price.toFixed(2)} TL</p>
            </div>
            <div class="book-actions">
                <button onclick="toggleFavorite(${book.id})" class="action-btn">
                    <i class="fas fa-heart ${favorites.includes(book.id) ? 'text-danger' : ''}"></i>
                </button>
                <button onclick="addToCart(${book.id})" class="action-btn">
                    <i class="fas fa-shopping-cart"></i>
                </button>
            </div>
        `;
        console.log('Book card created successfully');
        return div;
    } catch (error) {
        console.error('Error creating book card:', error);
        return null;
    }
}

// Kategoriye göre kitapları filtrele
function filterBooks(category) {
    if (category === 'Tümü') {
        displayBooks();
    } else {
        const filteredBooks = books.filter(book => book.category === category);
        displayBooks(filteredBooks);
    }
}

// Sepete ekle
function addToCart(bookId) {
    const book = books.find(b => b.id === bookId);
    if (book) {
        const existingItem = cart.find(item => item.id === bookId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...book, quantity: 1 });
        }
        updateCartCount();
        updateCartDisplay();
    }
}

// Favorilere ekle/çıkar
function toggleFavorite(bookId) {
    const index = favorites.indexOf(bookId);
    if (index === -1) {
        favorites.push(bookId);
    } else {
        favorites.splice(index, 1);
    }
    displayBooks();
    updateFavoritesDisplay();
}

// Sepet sayısını güncelle
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Sepet görünümünü güncelle
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    if (!cartItems) return;

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="cart-item-image">
            <div class="cart-item-info">
                <h3>${item.title}</h3>
                <p>${item.author}</p>
                <p>${item.price.toFixed(2)} TL x ${item.quantity}</p>
                <p>Toplam: ${itemTotal.toFixed(2)} TL</p>
                <button onclick="removeFromCart(${item.id})">Kaldır</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    // Toplam tutarları güncelle
    updateTotals(total);
}

// Toplam tutarları güncelle
function updateTotals(subtotal) {
    const shipping = subtotal > 0 ? 14.90 : 0;
    const total = subtotal + shipping;

    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const totalElement = document.getElementById('total');

    if (subtotalElement) subtotalElement.textContent = `${subtotal.toFixed(2)} TL`;
    if (shippingElement) shippingElement.textContent = `${shipping.toFixed(2)} TL`;
    if (totalElement) totalElement.textContent = `${total.toFixed(2)} TL`;
}

// Sepetten ürün kaldır
function removeFromCart(bookId) {
    const index = cart.findIndex(item => item.id === bookId);
    if (index !== -1) {
        cart.splice(index, 1);
        updateCartCount();
        updateCartDisplay();
    }
}

// Favoriler sayfasını güncelle
function updateFavoritesDisplay() {
    const container = document.getElementById('favoritesContainer');
    if (!container) return;

    container.innerHTML = '';
    const favoriteBooks = books.filter(book => favorites.includes(book.id));
    favoriteBooks.forEach(book => {
        const bookCard = createBookCard(book);
        container.appendChild(bookCard);
    });
}

// Login işlemi
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Burada gerçek bir login işlemi yapılacak
    console.log('Login attempt:', { email, password });
    alert('Giriş başarılı!');
}

// Ödeme işlemi
function handlePayment(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const paymentInfo = Object.fromEntries(formData.entries());

    // Burada gerçek bir ödeme işlemi yapılacak
    console.log('Payment attempt:', paymentInfo);
    alert('Ödeme başarılı! Siparişiniz alındı.');
    
    // Sepeti temizle
    cart = [];
    updateCartCount();
    window.location.href = '../index.html';
} 