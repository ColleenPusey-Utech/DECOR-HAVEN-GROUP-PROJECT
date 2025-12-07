//  GLOBAL CONSTANTS & UTILITIES

const TAX_RATE = 0.15; // 15% tax
const DISCOUNT_RATE = 0.1; // 10% discount 

// Save current user to localStorage
function saveCurrentUser(user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
}

// Get current user
function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser"));
}

// ======================================================================
//  2. PRODUCT CATALOGUE - COLLEEN PUSEY 2203010
// a.	After checkout, generate an invoice with the following details:
//`Name of company`
//`Date of invoice`
//`Shipping information` (from checkout)
//`Invoice number` (unique)
//‘trn’
//`Purchased items` (name, quantity, price, discount)
//`Taxes`
//`Subtotal`
//`Total cost`
// ======================================================================
const defaultProducts = [
    {
        name: "Red Ornaments",
        price: 25.0,
        description: "A set of elegant hanging ornaments perfect for adding seasonal charm to any space.",
        image: "../assets/ornaments.jpg",
    },
    {
        name: "Honeycomb Candle Tree",
        price: 35.0,
        description: "A handcrafted honeycomb candle shaped like a festive tree, giving a warm glow.",
        image: "../assets/honeycombtree.jpg",
    },
    {
        name: "Christmas Stockings",
        price: 40.0,
        description: "Soft, premium holiday stockings ideal for decorating fireplaces and gift surprises.",
        image: "../assets/stockings.jpg",
    },
    {
        name: "Aromatic Candle Set",
        price: 30.0,
        description: "A scented candle set designed to create a calming and cozy atmosphere.",
        image: "../assets/candles.jpg",
    },
    {
        name: "Reindeer Figurine",
        price: 45.0,
        description: "A detailed reindeer sculpture that adds a festive touch to home décor.",
        image: "../assets/deer.jpg",
    },
    {
        name: "Luxury Candle",
        price: 22.0,
        description: "A premium candle with a clean burn and refreshing fragrance.",
        image: "../assets/candle.jpg",
    },
    {
        name: "Lava Lamp",
        price: 60.0,
        description: "A classic, relaxing lava lamp that brings vibrant color and retro vibes.",
        image: "../assets/lavalamp.jpg",
    },
    {
        name: "Wall Art",
        price: 120.0,
        description: "A modern abstract wall art piece crafted to elevate any living space.",
        image: "../assets/wallart.jpg",
    },
    {
        name: "Leopard Print Rug",
        price: 180.0,
        description: "A soft, stylish rug with a bold leopard print design, perfect for bedrooms or lounges.",
        image: "../assets/rug.jpg",
    },
    {
        name: "Decorative Clock",
        price: 55.0,
        description: "A sleek and minimalist wall clock that blends function with modern style.",
        image: "../assets/clock.jpg",
    },
    {
        name: "Elegant Vase",
        price: 65.0,
        description: "A ceramic vase with a smooth finish, ideal for flowers or as a standalone piece.",
        image: "../assets/vase.jpg",
    },
    {
        name: "Ottoman",
        price: 140.0,
        description: "A plush decorative ottoman providing comfort and extra seating in any room.",
        image: "../assets/ottoman.jpg",
    },
    {
        name: "Dancer Sculpture",
        price: 95.0,
        description: "A graceful sculpture capturing the motion of dance—perfect as a centerpiece.",
        image: "../assets/dancersculpture.jpg",
    },
    {
        name: "Throw Pillow",
        price: 35.0,
        description: "A soft and stylish decorative pillow that enhances comfort and décor.",
        image: "../assets/pillow.jpg",
    },
    {
        name: "Molecule Decor",
        price: 50.0,
        description: "A geometric molecule-shaped ornament for adding a modern artistic flair.",
        image: "../assets/molecule.jpg",
    },
];

// SAVE ONLY IF NOT ALREADY SAVED
if (!localStorage.getItem("AllProducts")) {
    localStorage.setItem("AllProducts", JSON.stringify(defaultProducts));
}

/*  
====================================================================================
c.	Display the product list dynamically on the website. - COLLEEN PUSEY-2203010
====================================================================================
*/
function displayProducts() {
    const productsContainer = document.getElementById("product-list");
    if (!productsContainer) return; // Exit if not on products page

    const AllProducts = JSON.parse(localStorage.getItem("AllProducts")) || [];

    productsContainer.innerHTML = "";

    AllProducts.forEach((p, index) => {
        productsContainer.innerHTML += `
            <div class="product-card">
                <img src="${p.image}" alt="${p.name}">
                <h2>${p.name}</h2>
                <p>${p.description}</p>
                <h3>$${p.price.toFixed(2)}</h3>

                <button onclick="addToCart(${index})">Add to Cart</button>
            </div>
        `;
    });
}

/*  
====================================================================================
e.	Add to Cart: - COLLEEN PUSEY- 2203010
i.	Shopping Cart (localStorage and Objects)
1.	When a user clicks the “Add to Cart” button, add the selected product to the user’s shopping cart. 
2.	Shopping cart must include, product details along with the taxes, discounts, subtotal and current total cost. 

====================================================================================
*/
function addToCart(index) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        alert("Please login first!");
        return;
    }

    const AllProducts = JSON.parse(localStorage.getItem("AllProducts")) || [];
    const product = AllProducts[index];

    if (!currentUser.cart) {
        currentUser.cart = {};
    }

    // If product already in cart, increase quantity
    if (currentUser.cart[product.name]) {
        currentUser.cart[product.name].quantity += 1; // Increment quantity if already in cart
    } else {
        currentUser.cart[product.name] = {
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
        };
    }

    // Save updated user back to localStorage
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    alert(`${product.name} added to cart!`);
}

/*  
====================================================================================
FUNCTION: LOAD CART PAGE - COLLEEN PUSEY 2203010
 Renders cart with quantities, subtotal, discount, tax, total
====================================================================================
*/
function loadCartPage() {
    const cartContainer = document.getElementById("cart-items");
    if (!cartContainer) return; // Exit if not on cart page

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let cart = currentUser?.cart || {};

    if (Object.keys(cart).length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    const TAX_RATE = 0.15;
    const DISCOUNT_RATE = 0.1;
    let grandTotal = 0;

    cartContainer.innerHTML = "";

    const table = document.createElement("table");
    table.classList.add("cart-table");
    table.innerHTML = `
        <tr>
            <th>Image</th>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th>Discount</th>
            <th>Tax</th>
            <th>Total</th>
            <th>Actions</th>
        </tr>
    `;

    // Loop through cart items
    for (let key in cart) {
        const item = cart[key];
        const subtotal = item.price * item.quantity;
        const discount = subtotal * DISCOUNT_RATE;
        const tax = (subtotal - discount) * TAX_RATE;
        const total = subtotal - discount + tax;
        grandTotal += total;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td><img src="${item.image}" alt="${item.name}" width="50"></td>
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td><input type="number" min="1" value="${item.quantity}" data-name="${item.name}" class="qtyInput"></td>
            <td>$${subtotal.toFixed(2)}</td>
            <td>$${discount.toFixed(2)}</td>
            <td>$${tax.toFixed(2)}</td>
            <td>$${total.toFixed(2)}</td>
            <td><button class="removeBtn" data-name="${item.name}">Remove</button></td>
        `;
        table.appendChild(row);
    }

    cartContainer.appendChild(table);

    cartContainer.innerHTML += `<h3 style="text-align:right; margin-top:20px;">Grand Total: $${grandTotal.toFixed(2)}</h3>`;

    /*  
====================================================================================
Event: Update Quantity - COLLEEN PUSEY 2203010
====================================================================================
*/
    cartContainer.querySelectorAll(".qtyInput").forEach((input) => {
        input.addEventListener("change", () => {
            const name = input.dataset.name;
            const qty = parseInt(input.value);
            if (qty <= 0) delete cart[name];
            else cart[name].quantity = qty;

            // Update localStorage
            currentUser.cart = cart;
            let users = JSON.parse(localStorage.getItem("RegistrationData")) || [];
            const idx = users.findIndex((u) => u.trn === currentUser.trn);
            if (idx !== -1) {
                users[idx] = currentUser;
                localStorage.setItem("RegistrationData", JSON.stringify(users));
                localStorage.setItem("currentUser", JSON.stringify(currentUser));
            }

            // Re-render cart
            loadCartPage();
        });
    });

    /*  
=========================================================================
 Event: Remove Item - COLLEEN PUSEY 2203010
=========================================================================
*/
    cartContainer.querySelectorAll(".removeBtn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const name = btn.dataset.name;
            delete cart[name];

            currentUser.cart = cart;
            let users = JSON.parse(localStorage.getItem("RegistrationData")) || [];
            const idx = users.findIndex((u) => u.trn === currentUser.trn);
            if (idx !== -1) {
                users[idx] = currentUser;
                localStorage.setItem("RegistrationData", JSON.stringify(users));
                localStorage.setItem("currentUser", JSON.stringify(currentUser));
            }

            loadCartPage();
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    /*  
=========================================================================
 SLIDESHOW FUNCTION - COLLEEN PUSEY 2203010
=========================================================================
*/
    let slides = document.getElementsByClassName("slides");
    if (slides.length > 0) {
        let slideIndex = 0;
        function showSlides() {
            for (let i = 0; i < slides.length; i++) slides[i].style.display = "none";
            slideIndex++;
            if (slideIndex > slides.length) slideIndex = 1;
            slides[slideIndex - 1].style.display = "block";
            setTimeout(showSlides, 3000);
        }
        showSlides();
    }

    /*  
=========================================================================
 LOAD CURRENT USER & CART - COLLEEN PUSEY 2203010
=========================================================================
*/
    const dropdownMenu = document.getElementById("dropdownMenu");
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let cart = currentUser ? currentUser.cart || {} : {};

    if (dropdownMenu) {
        dropdownMenu.innerHTML = ""; // Clear existing items

        if (currentUser) {
            // Display  user name
            const userNameItem = document.createElement("li");
            userNameItem.textContent = `Hello, ${currentUser.firstName}`;
            dropdownMenu.appendChild(userNameItem);

            // Dashboard link
            const dashboardItem = document.createElement("li");
            const dashboardLink = document.createElement("a");
            dashboardLink.href = "dashboard.html";
            dashboardLink.textContent = "Dashboard";
            dashboardItem.appendChild(dashboardLink);
            dropdownMenu.appendChild(dashboardItem);

            // Logout option
            const logoutItem = document.createElement("li");
            const logoutLink = document.createElement("a");
            logoutLink.href = "#";
            logoutLink.textContent = "Logout";
            logoutLink.addEventListener("click", () => {
                localStorage.removeItem("currentUser"); // Remove user from localStorage
                location.reload(); // Refresh page to update menu
            });
            logoutItem.appendChild(logoutLink);
            dropdownMenu.appendChild(logoutItem);
        } else {
            // If no user logged in, show login/register links
            const loginItem = document.createElement("li");
            const loginLink = document.createElement("a");
            loginLink.href = "login.html";
            loginLink.textContent = "Login";
            loginItem.appendChild(loginLink);
            dropdownMenu.appendChild(loginItem);

            const registerItem = document.createElement("li");
            const registerLink = document.createElement("a");
            registerLink.href = "registration.html";
            registerLink.textContent = "Register";
            registerItem.appendChild(registerLink);
            dropdownMenu.appendChild(registerItem);
        }
    }

    /*  
=========================================================================
INPUT FORMATTERS - COLLEEN PUSEY 2203010
=========================================================================
*/
    // Format TRN input as XXX-XXX-XXX
    function formatTRN(input) {
        input.addEventListener("input", () => {
            let digits = input.value.replace(/\D/g, "").slice(0, 9);
            let part1 = digits.slice(0, 3);
            let part2 = digits.slice(3, 6);
            let part3 = digits.slice(6, 9);
            let formatted = part1;
            if (part2) formatted += "-" + part2;
            if (part3) formatted += "-" + part3;
            input.value = formatted;
        });
    }

    // Format phone input as XXX-XXX-XXXX
    function formatPhone(input) {
        input.addEventListener("input", () => {
            let digits = input.value.replace(/\D/g, "").slice(0, 10);
            let p1 = digits.slice(0, 3);
            let p2 = digits.slice(3, 6);
            let p3 = digits.slice(6, 10);
            let formatted = p1;
            if (p2) formatted += "-" + p2;
            if (p3) formatted += "-" + p3;
            input.value = formatted;
        });
    }

    // Apply TRN formatting to all relevant fields
    let trnInputs = document.querySelectorAll("#trn, #reset-trn, #searchTRN");
    trnInputs.forEach((i) => formatTRN(i));

    // Apply phone formatting if field exists
    let phoneInput = document.querySelector("#phone");
    if (phoneInput) formatPhone(phoneInput);

    // ======================================================================
    //  1.b) LOGIN FUNCTIONALITY - COLLEEN PUSEY 2203010
    //  i.	create a login form where visitors can enter their TRN and password provided at registration.
    //  ii.	validate this login data by checking the currently entered trn and password against data associated with the localStorage key called, RegistrationData.
    // iii.	a visitor is given three (3) attempts to enter a correct trn and password. If login is successful, redirect the user to the product catalog. Otherwise, redirect the user to an error/account locked page.
    // ======================================================================

    // Get login form
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        // Get all required input elements from the login form
        const trnInput = document.getElementById("trn");
        const passwordInput = document.getElementById("login-password");
        const loginError = document.getElementById("loginError");
        const cancelBtn = document.getElementById("cancelBtn");

        // Retrieve login attempts from localStorage OR default to 3
        let attempts = parseInt(localStorage.getItem("LoginAttempts")) || 3;

        // login form submission event
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            loginError.textContent = "";

            // Retrieve list of all registered users
            let registrationData = JSON.parse(localStorage.getItem("RegistrationData")) || [];

            // Collect user entered login details
            const enteredTRN = trnInput.value.trim();
            const enteredPass = passwordInput.value.trim();

            // validation: Check if inputs are empty
            if (!enteredTRN || !enteredPass) {
                loginError.textContent = "Please enter TRN and password.";
                return;
            }

            // Find matching user in localStorage
            const user = registrationData.find((u) => u.trn === enteredTRN && u.password === enteredPass);

            // If user exists and password matches then login successful
            if (user && user.password === enteredPass) {
                localStorage.setItem("currentUser", JSON.stringify(user)); // Save current user
                localStorage.setItem("LoginAttempts", 3); // Reset attempts
                alert("Login successful!");
                window.location.href = "index.html"; // Redirect to homepage
                return;
            }

            // If login fails, reduce attempts
            attempts--;
            localStorage.setItem("LoginAttempts", attempts);

            // Show attempts remaining or lock account
            if (attempts > 0) {
                loginError.textContent = `Invalid TRN or password. Attempts left: ${attempts}`;
            } else {
                // Reset attempts and lock account
                localStorage.setItem("LoginAttempts", 3);
                window.location.href = "acclocked.html"; // Redirect to locked page
            }
        });

        //Cancel button (used to clear data from the Login form)
        if (cancelBtn) {
            cancelBtn.addEventListener("click", () => {
                loginForm.reset();
                loginError.textContent = "";
            });
        }
    }

    // ======================================================================
    //  PASSWORD RESET FUNCTIONALITY - COLLEEN PUSEY- 22O3O10
    //  Allows a user to reset their password by entering:
    //      - TRN
    //      - New Password (min 8 chars)
    //      - Confirm Password
    //  Updates password in localStorage after validation.
    // ======================================================================

    const resetForm = document.getElementById("resetForm");

    if (resetForm) {
        // Create an element to display error messages
        const resetError = document.createElement("p");
        resetError.id = "resetError";
        resetError.style.color = "red";
        resetForm.appendChild(resetError);

        // reset password form submission
        resetForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Retrieve all input fields
            const trn = document.getElementById("reset-trn").value.trim();
            const newPass = document.getElementById("newPass").value;
            const confirmPass = document.getElementById("confirmPass").value;

            // Get all users from localStorage
            let users = JSON.parse(localStorage.getItem("RegistrationData")) || [];

            // Find user by TRN
            const userIndex = users.findIndex((user) => user.trn === trn);

            if (userIndex === -1) {
                resetError.textContent = "TRN not found. Please check and try again.";
                resetError.style.color = "red";
                return;
            }

            // Validate new password strength
            if (newPass.length < 8) {
                resetError.textContent = "Password must be at least 8 characters long.";
                resetError.style.color = "red";
                return;
            }

            // Check if passwords match
            if (newPass !== confirmPass) {
                resetError.textContent = "Passwords do not match.";
                resetError.style.color = "red";
                return;
            }

            // Update password
            users[userIndex].password = newPass;
            localStorage.setItem("RegistrationData", JSON.stringify(users));

            // Show success message
            resetError.textContent = "Password reset successful! You can now log in.";
            // Clear form
            resetForm.reset();
        });
    }

    // ======================================================================
    //  1. a) REGISTRATION FORM - COLLEEN PUSEY 2203010
    //i. create a registration form where users can enter their first name, last name, date of birth, gender,
    //  phone number, email, tax registration number (trn), and password, etc.
    // ======================================================================

    // Get the registration form
    const registrationForm = document.getElementById("registrationForm");
    if (registrationForm) {
        const errorMsg = document.getElementById("errorMsg"); // Display errors
        const cancelBtn = document.getElementById("cancelBtn"); // Reset form button

        registrationForm.addEventListener("submit", (e) => {
            e.preventDefault();
            errorMsg.textContent = "";

            // Retrieve all registered users from localStorage
            let registrationData = JSON.parse(localStorage.getItem("RegistrationData")) || [];

            // Collect form input
            const firstName = document.getElementById("firstName").value.trim();
            const lastName = document.getElementById("lastName").value.trim();
            const dob = document.getElementById("dob").value;
            const gender = document.getElementById("gender").value;
            const phone = document.getElementById("phone").value.trim();
            const email = document.getElementById("email").value.trim();
            const trn = document.getElementById("trn").value.trim();
            const password = document.getElementById("password").value.trim();

            //ii. all fields are filled (HTML validation). JavaScript Error handling.
            if (!firstName || !lastName || !dob || !gender || !phone || !email || !trn || !password) {
                errorMsg.textContent = "Please fill in all fields.";
                return;
            }

            //iv.	visitor must be over 18 years old to register. Calculate age using JavaScript.
            const age = new Date().getFullYear() - new Date(dob).getFullYear();
            if (age < 18) {
                errorMsg.textContent = "You must be at least 18 years old.";
                return;
            }

            //iii.	passwords should be at least 8 characters long.
            if (password.length < 8) {
                errorMsg.textContent = "Password must be at least 8 characters long.";
                return;
            }

            // v.	trn is unique; must be of length and in the format (000-000-000).
            if (!/^\d{3}-\d{3}-\d{3}$/.test(trn)) {
                errorMsg.textContent = "Invalid TRN format. Use 000-000-000.";
                return;
            }

            // Validate phone format (000-000-0000)
            if (!/^\d{3}-\d{3}-\d{4}$/.test(phone)) {
                errorMsg.textContent = "Invalid phone format. Use 000-000-0000.";
                return;
            }

            // Check for duplicate TRN
            if (registrationData.some((u) => u.trn === trn)) {
                errorMsg.textContent = "TRN already exists.";
                return;
            }

            // Create new user object
            const newUser = {
                firstName,
                lastName,
                dob,
                gender,
                phone,
                email,
                trn,
                password,
                cart: {},
                invoices: [],
                dateRegistered: new Date().toLocaleString(),
            };

            // Save new user to localStorage
            registrationData.push(newUser);
            localStorage.setItem("RegistrationData", JSON.stringify(registrationData));

            alert("Registration successful!");
            registrationForm.reset(); // Clear form
            window.location.href = "login.html"; // Redirect to login page
        });

        // Cancel button: clears form and errors
        if (cancelBtn) {
            cancelBtn.addEventListener("click", () => {
                registrationForm.reset();
                errorMsg.textContent = "";
            });
        }
    }

    // ======================================================================
    //  3.CART PAGE - RHIAN SANG - 2203004
    //a.	Create a shopping cart page that lists the items in the cart
    //     (name, price, quantity, sub-total, discount, tax, and total, etc).
    // ======================================================================
    const cartItemsContainer = document.getElementById("cart-items"); // Container for cart items
    const cartTotalsContainer = document.getElementById("cart-totals"); // Display totals
    const clearCartBtn = document.getElementById("clearCart"); // Clear cart button
    const checkoutBtn = document.getElementById("checkoutBtn"); // Proceed to checkout
    const closeCartBtn = document.getElementById("closeCart"); // Close cart page

    const TAX_RATE = 0.15; // 15% tax
    const DISCOUNT_RATE = 0.1; // 10% discount

    // Renders the cart table on the page
    function renderCart() {
        if (!cartItemsContainer) return; // Exit if no cart element
        cartItemsContainer.innerHTML = "";
        cartTotalsContainer.innerHTML = "";

        if (!cart || Object.keys(cart).length === 0) {
            cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
            return;
        }

        const table = document.createElement("table");
        table.classList.add("cart-table");
        table.innerHTML = `
               <tr>
            <th>Image</th>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th>Discount</th>
            <th>Tax</th>
            <th>Total</th>
            <th>Actions</th>
        </tr>
    `;
        let grandTotal = 0;

        for (let key in cart) {
            const item = cart[key];
            const subtotal = item.price * item.quantity;
            const discount = subtotal * DISCOUNT_RATE;
            const tax = (subtotal - discount) * TAX_RATE;
            const total = subtotal - discount + tax;
            grandTotal += total;

            const row = document.createElement("tr");
            row.innerHTML = `
            <td><img src="${item.image}" alt="${item.name}" width="50"></td>
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td><input type="number" min="1" value="${item.quantity}" data-name="${
                item.name
            }" class="qtyInput"></td>
                <td>$${subtotal.toFixed(2)}</td>
                <td>$${discount.toFixed(2)}</td>
                <td>$${tax.toFixed(2)}</td>
                <td>$${total.toFixed(2)}</td>
                <td><button class="removeBtn" data-name="${item.name}">Remove</button></td>
            `;
            table.appendChild(row);
        }

        cartItemsContainer.appendChild(table);

        // Attach events
        attachCartEvents(); //b. Allow users to remove items from the cart and update quantities.
    }

    // Attach cart events to buttons and quantity inputs
    function attachCartEvents() {
        cartItemsContainer.querySelectorAll(".removeBtn").forEach((btn) => {
            btn.addEventListener("click", () => {
                delete cart[btn.dataset.name]; // Remove item
                saveCart(); // Update localStorage
                renderCart();
            });
        });

        cartItemsContainer.querySelectorAll(".qtyInput").forEach((input) => {
            input.addEventListener("change", () => {
                const name = input.dataset.name;
                const qty = parseInt(input.value);
                if (qty <= 0) delete cart[name];
                else cart[name].quantity = qty;
                saveCart();
                renderCart();
            });
        });
    }

    // Save cart to localStorage for current user
    function saveCart() {
        currentUser.cart = cart;
        let users = JSON.parse(localStorage.getItem("RegistrationData")) || [];
        const idx = users.findIndex((u) => u.trn === currentUser.trn);
        if (idx !== -1) {
            users[idx] = currentUser;
            localStorage.setItem("RegistrationData", JSON.stringify(users));
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
        }
    }

    // Clear cart button functionality
    if (clearCartBtn) {
        clearCartBtn.addEventListener("click", () => {
            if (confirm("Clear cart?")) {
                cart = {};
                saveCart();
                renderCart();
            }
        });
    }

    // Proceed to checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => (window.location.href = "checkout.html"));
    }

    // Close cart page button
    if (closeCartBtn) {
        closeCartBtn.addEventListener("click", () => (window.location.href = "products.html"));
    }

    // Initial cart render
    renderCart();

    // ======================================================================
    //  PRODUCT LIST RENDERING - COLLEEN PUSEY - 2203010
    // ======================================================================
    const productsContainer = document.getElementById("product-list");

    if (productsContainer) {
        const AllProducts = JSON.parse(localStorage.getItem("AllProducts")) || [];
        productsContainer.innerHTML = "";

        AllProducts.forEach((p, index) => {
            productsContainer.innerHTML += `
                <div class="product-card">
                    <img src="${p.image}" alt="${p.name}">
                    <h2>${p.name}</h2>
                    <p>${p.description}</p>
                    <h3>$${p.price.toFixed(2)}</h3>

                    <button onclick="addToCart(${index})">
                        Add to Cart
                    </button>
                </div>
            `;
        });
    }
    // Load cart page function
    loadCartPage();

    // ======================================================================
    //  4.CHECKOUT FUNCTION  - RHIAN SANG - 2203004
    // ======================================================================

    // Get page elements for checkout
    const cartSummaryContainer = document.getElementById("cart-summary");
    const checkoutForm = document.getElementById("checkoutForm");
    const cancelCheckoutBtn = document.getElementById("cancelCheckout");
    const invoiceContainer = document.getElementById("invoice");

    // ======================================================================
    //  a.	Show a summary of the shopping cart with the total cost. - RHIAN SANG - 2203004
    // ======================================================================
    function displayCartSummary() {
        if (!cart || Object.keys(cart).length === 0) {
            // Hide checkout form if cart is empty
            if (checkoutForm) checkoutForm.style.display = "none";
            return;
        }

        let grandTotal = 0;
        // Create a table for cart items
        const table = document.createElement("table");
        table.classList.add("cart-table");
        table.innerHTML = `
        <tr>
            <th>Image</th>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th>Discount</th>
            <th>Tax</th>
            <th>Total</th>
        </tr>
    `;

        // Loop through each item in cart
        for (let key in cart) {
            const item = cart[key];
            const subtotal = item.price * item.quantity;
            const discount = subtotal * DISCOUNT_RATE;
            const tax = (subtotal - discount) * TAX_RATE;
            const total = subtotal - discount + tax;
            grandTotal += total;

            const row = document.createElement("tr");
            row.innerHTML = `
            <td><img src="${item.image}" alt="${item.name}" width="50"></td>
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>$${subtotal.toFixed(2)}</td>
            <td>$${discount.toFixed(2)}</td>
            <td>$${tax.toFixed(2)}</td>
            <td>$${total.toFixed(2)}</td>
        `;
            table.appendChild(row);
        }

        cartSummaryContainer.innerHTML = ""; // Clear previous content
        cartSummaryContainer.appendChild(table); // Add cart table

        // Display grand total
        const totalDiv = document.createElement("div");
        totalDiv.innerHTML = `<h3>Grand Total: $${grandTotal.toFixed(2)}</h3>`;
        cartSummaryContainer.appendChild(totalDiv);
    }

    // Run display function
    displayCartSummary();

    // ======================================================================
    // RHIAN SANG - 2203004
    //  CHECKOUT FORM SUBMISSION b.	Allow the user to enter their shipping details (e.g., name, address, amount being paid).
    // ======================================================================
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Get user input from form
            const fullName = document.getElementById("fullName").value.trim();
            const address = document.getElementById("address").value.trim();
            const amountPaid = parseFloat(document.getElementById("amountPaid").value);

            // Validate input
            if (!fullName || !address || isNaN(amountPaid)) {
                alert("Please fill in all fields correctly.");
                return;
            }

            // Initialize totals
            let subtotal = 0;
            let discountTotal = 0;
            let taxTotal = 0;

            // Calculate totals and prepare purchased items
            const purchasedItems = Object.values(cart).map((item) => {
                const itemSubtotal = item.price * item.quantity;
                const itemDiscount = itemSubtotal * DISCOUNT_RATE;
                const itemTax = (itemSubtotal - itemDiscount) * TAX_RATE;

                subtotal += itemSubtotal;
                discountTotal += itemDiscount;
                taxTotal += itemTax;

                return {
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    discount: itemDiscount,
                    tax: itemTax,
                    subtotal: itemSubtotal,
                };
            });

            const totalCost = subtotal - discountTotal + taxTotal;

            // Check if amount paid is sufficient
            if (amountPaid < totalCost) {
                alert(`Insufficient amount. Total is $${totalCost.toFixed(2)}`);
                return;
            }

            // ======================================================================
            // TEREL WALLACE - 2408416
            //  5. GENERATE INVOICE OBJECT a.	After checkout, generate an invoice with the following details:
            //`Name of company`
            //`Date of invoice`
            //`Shipping information` (from checkout)
            //`Invoice number` (unique)
            //‘trn’
            //`Purchased items` (name, quantity, price, discount)
            //`Taxes`
            //`Subtotal`
            //`Total cost`
            // ======================================================================

            const invoice = {
                companyName: "Decor Haven",
                invoiceNumber: "INV-" + Date.now(), // Unique invoice number
                date: new Date().toLocaleString(),
                shippingInfo: {
                    customer: fullName,
                    address: address,
                },
                trn: currentUser.trn,
                items: purchasedItems,
                subtotal,
                discountTotal,
                taxTotal,
                totalCost,
                amountPaid,
                change: amountPaid - totalCost,
            };

            // ======================================================================
            // TEREL WALLACE - 2408416
            //  SAVE INVOICE TO CURRENT USER b.	Append this invoice to the user’s array of invoices (array of objects). Also store the invoice to localStorage with the key called AllInvoices (as an array of objects) to access later.
            // ======================================================================

            if (!currentUser.invoices) currentUser.invoices = [];
            currentUser.invoices.push(invoice);

            // Save updated user
            let users = JSON.parse(localStorage.getItem("RegistrationData")) || [];
            const userIndex = users.findIndex((u) => u.trn === currentUser.trn);
            users[userIndex] = currentUser;
            localStorage.setItem("RegistrationData", JSON.stringify(users));
            localStorage.setItem("currentUser", JSON.stringify(currentUser));

            // ======================================================================
            //  SAVE INVOICE TO GLOBAL LIST
            // ======================================================================
            let allInvoices = JSON.parse(localStorage.getItem("AllInvoices")) || [];
            allInvoices.push(invoice);
            localStorage.setItem("AllInvoices", JSON.stringify(allInvoices));

            //   ======================================================================
            //  CLEAR CART AFTER PURCHASE
            // ======================================================================
            currentUser.cart = {};
            localStorage.setItem("currentUser", JSON.stringify(currentUser));

            // ======================================================================
            //  DISPLAY INVOICE ON PAGE
            // ======================================================================

            invoiceContainer.innerHTML = `
        <h2>Invoice</h2>
        <p><strong>${invoice.companyName}</strong></p>
        <p><strong>Date:</strong> ${invoice.date}</p>
        <p><strong>Invoice #:</strong> ${invoice.invoiceNumber}</p>
        <p><strong>TRN:</strong> ${invoice.trn}</p>

        <h3>Shipping Information</h3>
        <p>${invoice.shippingInfo.customer}</p>
        <p>${invoice.shippingInfo.address}</p>

        <h3>Purchased Items</h3>
        <table border="1" cellspacing="0">
            <tr>
                <th>Name</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Tax</th>
                <th>Subtotal</th>
            </tr>
            ${invoice.items
            .map(
                (item) => `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>$${item.discount.toFixed(2)}</td>
                    <td>$${item.tax.toFixed(2)}</td>
                    <td>$${item.subtotal.toFixed(2)}</td>
                </tr>`
            )
            .join("")}
        </table>

        <h3>Totals</h3>
        <p>Subtotal: $${invoice.subtotal.toFixed(2)}</p>
        <p>Discounts: -$${invoice.discountTotal.toFixed(2)}</p>
        <p>Taxes: $${invoice.taxTotal.toFixed(2)}</p>
        <p><strong>Total: $${invoice.totalCost.toFixed(2)}</strong></p>
        <p>Amount Paid: $${invoice.amountPaid.toFixed(2)}</p>
        <p>Change: $${invoice.change.toFixed(2)}</p>

        <button onclick="window.location.href='index.html'">Back to Home</button>
        <button id="printInvoiceBtn">Print Invoice</button>

    `;

            alert("Invoice sent to your email!");
            checkoutForm.style.display = "none"; // Hide checkout form
            cartSummaryContainer.style.display = "none"; // Hide cart summary

                const printBtn = document.getElementById("printInvoiceBtn");
                if (printBtn) {
                    printBtn.addEventListener("click", () => {
                        window.print();
                    });
                }
        });
    }

    // Cancel checkout button redirects back to cart page
    if (cancelCheckoutBtn) {
        cancelCheckoutBtn.addEventListener("click", () => {
            window.location.href = "cart.html";
        });
    }

    // ================================
    // 6. ADDITIONAL FUNCTIONALITY - TEREL WALLACE - 2408416
    // ================================

    // -----------------------------
    // a.	ShowUserFrequency() – Show’s user requency based on Gender and Age Group:
    // -----------------------------
    const {genderCount, ageGroups} = ShowUserFrequency();

    // -----------------------------
    // GENDER CHART
    // -----------------------------
    new Chart(document.getElementById("genderChart"), {
        type: "bar",
        data: {
            labels: Object.keys(genderCount), // Male, Female, Other
            datasets: [
                {
                    label: "Users",
                    data: Object.values(genderCount), // Count per gender
                },
            ],
        },
    });

    // -----------------------------
    // AGE GROUP CHART
    // -----------------------------
    new Chart(document.getElementById("ageChart"), {
        type: "bar", // Bar chart
        data: {
            labels: Object.keys(ageGroups), // Age ranges
            datasets: [
                {
                    label: "Users",
                    data: Object.values(ageGroups), // Count per age group
                },
            ],
        },
    });

    //-------------------------------------
    // Search Invoices by TRN
    //-------------------------------------
    document.getElementById("searchBtn").addEventListener("click", () => {
        const trn = document.getElementById("searchTRN").value;
        const results = ShowInvoices(trn);

        let box = document.getElementById("searchResults");
        box.innerHTML = "<h3>Results:</h3><pre>" + JSON.stringify(results, null, 2) + "</pre>";
    });

    // -----------------------------
    // Display Logged-in User's Invoices
    // -----------------------------
    document.getElementById("loadUserInvoices").addEventListener("click", () => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        if (!user) return alert("No user logged in");

        const invoices = GetUserInvoices(user.trn);

        let tbody = document.querySelector("#userInvoiceTable tbody");
        tbody.innerHTML = "";

        invoices.forEach((inv) => {
            let row = `
                <tr>
                    <td>${inv.invoiceNumber}</td>
                    <td>${inv.date}</td>
                    <td>$${inv.totalCost}</td>
                    <td>${inv.items.length} items</td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    });

    // ================================
    // FUNCTION: ShowUserFrequency - TEREL WALLACE - 2408416
    // Calculates gender and age group counts
    // ================================
    function ShowUserFrequency() {
        const users = JSON.parse(localStorage.getItem("RegistrationData")) || [];

        let genderCount = {Male: 0, Female: 0, Other: 0};
        let ageGroups = {"18-25": 0, "26-35": 0, "36-50": 0, "50+": 0};

        // Calculate age from DOB
        function calcAge(dob) {
            let birth = new Date(dob);
            let now = new Date();
            let age = now.getFullYear() - birth.getFullYear();
            let m = now.getMonth() - birth.getMonth();
            if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
            return age;
        }

        users.forEach((user) => {
            // Count gender
            if (genderCount[user.gender] != null) genderCount[user.gender]++;
            else genderCount["Other"]++;

            //Count age group
            let age = calcAge(user.dob);
            if (age <= 25) ageGroups["18-25"]++;
            else if (age <= 35) ageGroups["26-35"]++;
            else if (age <= 50) ageGroups["36-50"]++;
            else ageGroups["50+"]++;
        });

        return {genderCount, ageGroups};
    }

    // ================================
    // FUNCTION: ShowInvoices - TEREL WALLACE - 2408416
    // Returns all invoices 
    // ================================
    function ShowInvoices(trn = "") {
        // Load invoices from localStorage
        const AllInvoices = JSON.parse(localStorage.getItem("AllInvoices")) || [];

        if (AllInvoices.length === 0) {
            console.log("No invoices found.");
            return [];
        }

        // If no TRN is provided then show all invoices
        if (trn.trim() === "") {
            console.log("All Invoices:", AllInvoices);
            return AllInvoices;
        }

        // Remove dashes for clean comparison
        const cleanTRN = trn.replace(/\D/g, "");

        // Filter invoices that match the TRN
        const results = AllInvoices.filter((inv) => inv.trn && inv.trn.replace(/\D/g, "") === cleanTRN);

        if (results.length === 0) {
            console.log("No invoice found for TRN:", trn);
        } else {
            console.log("Invoices found:", results);
        }

        return results;
    }


    // ================================
    // FUNCTION: GetUserInvoices - TEREL WALLACE - 2408416
    // Returns invoices for a specific user TRN
    // ================================
    function GetUserInvoices(trn) {
        const invoices = JSON.parse(localStorage.getItem("AllInvoices")) || [];
        return invoices.filter((inv) => inv.trn === trn);
    }
});
