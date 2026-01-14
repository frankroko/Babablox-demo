# Babablox E-Commerce Project

A Thai-language e-commerce website for buying and selling game accounts and in-game items.

## Project Structure

```
babablox-demo/
├── index.html                  # Homepage
├── README.md                   # Project documentation
├── css/
│   ├── style.css              # Main stylesheet (shared across all pages)
│   ├── login.css              # Login page styles
│   ├── register.css           # Registration page styles
│   ├── cart.css               # Shopping cart page styles
│   ├── order-history.css      # Order history page styles
│   └── product.css            # Product details page styles
├── js/
│   ├── index.js               # Homepage JavaScript
│   ├── login.js               # Login page JavaScript
│   ├── register.js            # Registration page JavaScript
│   ├── cart.js                # Shopping cart JavaScript
│   └── order-history.js       # Order history JavaScript
├── pages/
│   ├── login.html             # User login page
│   ├── register.html          # User registration page
│   ├── cart.html              # Shopping cart page
│   ├── product.html           # Product details page
│   └── order-history.html     # Order history page
├── assets/                    # Images, icons, and media files (future expansion)
└── .git/                      # Git repository
```

## Features

- **User Authentication**: Register and login functionality with localStorage
- **Product Catalog**: Browse and view product details
- **Shopping Cart**: Add/remove items, manage quantities
- **Order Management**: Place orders and view order history
- **Responsive Design**: Mobile-friendly interface

## File Descriptions

### Root Directory
- **index.html**: Main landing page with product showcase
- **README.md**: Project documentation

### CSS Directory (Modular Styling)
- **style.css**: Global styles (header, footer, buttons, etc.)
- **login.css**: Login page specific styles
- **register.css**: Registration page specific styles
- **cart.css**: Shopping cart page specific styles
- **order-history.css**: Order history page specific styles
- **product.css**: Product details page specific styles

### JavaScript Directory (Modular Logic)
- **index.js**: Homepage - login status, product interactions
- **login.js**: Login form handling and authentication
- **register.js**: Registration form handling
- **cart.js**: Cart management, quantity updates, checkout
- **order-history.js**: Order display and management

### Pages Directory (Dynamic Content)
- **login.html**: Clean HTML with external CSS/JS links
- **register.html**: Clean HTML with external CSS/JS links
- **cart.html**: Clean HTML with external CSS/JS links
- **product.html**: Clean HTML with external CSS/JS links
- **order-history.html**: Clean HTML with external CSS/JS links

### Assets Directory
- Reserved for images, icons, and other media files

## Getting Started

1. Open `index.html` in a web browser
2. Navigate through the site using the navigation menu
3. Register a new account or login
4. Browse products and add items to cart
5. Complete checkout to place an order

## Technologies Used

- **HTML5**: Semantic markup with clean structure
- **CSS3**: Modular, page-specific stylesheets
- **Vanilla JavaScript**: No dependencies, organized by functionality
- **LocalStorage**: Client-side data persistence for cart and user data

## Key Improvements

✅ **Separated Concerns**
- CSS files: One global style file + page-specific CSS files
- JavaScript files: One JS file per page with focused functionality
- HTML files: Clean, semantic markup without embedded code

✅ **Better Maintainability**
- Easy to find and update styles for specific pages
- JavaScript organized by functionality/pages
- Reduced file complexity for faster development

✅ **Performance Benefits**
- CSS can be cached separately
- JavaScript modules can be loaded independently
- Smaller file sizes per HTML document

✅ **Scalability**
- Easy to add new pages with separate CSS and JS
- Clear file naming conventions
- Logical folder organization

## Notes

- User data is stored in browser's localStorage
- No backend server required (frontend only)
- All styling is centralized in the `css/` folder with page-specific overrides
- All functionality is in the `js/` folder organized by page
- Thai language support included throughout the site
- Responsive design works on mobile, tablet, and desktop devices