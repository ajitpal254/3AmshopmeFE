# AmShoppee - E-Commerce Frontend

A modern, full-featured e-commerce frontend application built with React.js. This project provides a complete online shopping experience with user authentication, product browsing, shopping cart, checkout process, and order management.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Technologies](#technologies)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [API Integration](#api-integration)
- [Usage Guide](#usage-guide)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Project Overview

AmShoppee is a responsive e-commerce frontend application that provides a seamless shopping experience for users. Built with React.js and modern web technologies, it integrates with a RESTful backend API to deliver a full-featured online store.

The application supports multiple user roles:

- **Customers**: Browse products, manage cart, place orders, and track order history
- **Vendors**: Manage their product listings and inventory through a dedicated dashboard
- **Admins**: Full administrative access to manage products, users, and orders

## 🛠 Technologies

This project is built using the following technologies:

### Core Technologies

- **React.js** (v19.2.0) - Frontend framework for building user interfaces
- **React Router DOM** (v6.28.0) - Client-side routing and navigation
- **Redux** (v5.0.1) - Global state management
- **Redux Thunk** (v3.1.0) - Middleware for async actions
- **Context API** - Local state management for authentication and cart

### HTTP & API

- **Axios** (v1.9.0) - HTTP client for API requests
- **Apollo Client** (v3.3.13) - GraphQL client (optional integration)

### UI & Styling

- **React Bootstrap** (v1.5.2) - UI component library
- **Bootstrap** (v5.2.3) - CSS framework for responsive design
- **Custom CSS** - Additional styling and themes

### Authentication & Cloud Services

- **Firebase** (v11.7.1) - Authentication and cloud storage
- **JWT Decode** (v3.1.2) - JWT token parsing
- **React Google Login** (v5.2.2) - Google OAuth integration
- **Cloudinary React** (v1.8.1) - Image upload and management

### Development Tools

- **Vite** (v7.2.7) - Lightning-fast build tool and dev server
- **Vitest** - Fast unit testing framework
- **Redux DevTools Extension** - State debugging
- **React Testing Library** - Component testing
- **ESBuild** - Ultra-fast JavaScript bundler

## ✨ Features

### Customer Features

- **Responsive Design**: Mobile-first, responsive layout that works on all devices
- **Product Browsing**:
  - Browse products by categories
  - Search functionality for finding products
  - Detailed product view with images, descriptions, and ratings
  - Product filtering and sorting
- **Shopping Cart**:
  - Add/remove products from cart
  - Update product quantities
  - Real-time cart total calculation
  - Persistent cart (saved in localStorage and backend)
- **User Authentication**:
  - User registration and login
  - Google OAuth integration
  - JWT-based authentication
  - Email verification
  - Profile management with avatar upload
- **Checkout Process**:
  - Shipping address management
  - Order review and confirmation
  - Secure order placement
- **Order Management**:
  - View order history
  - Track order status
  - Order details and receipts

### Vendor Features

- **Vendor Dashboard**: Dedicated interface for vendors
- **Product Management**: Add, edit, and delete products
- **Inventory Management**: Track product stock levels
- **Order Management**: View and manage vendor-specific orders

### Admin Features

- **Admin Dashboard**: Complete administrative control
- **User Management**: Manage customer and vendor accounts
- **Product Administration**: Full product CRUD operations
- **Order Overview**: Monitor all orders across the platform

### Technical Features

- **Backend API Integration**: RESTful API integration
- **State Management**: Redux store with persistent storage
- **Image Uploads**: Cloudinary integration for product and profile images
- **Loading States**: Spinners and loading indicators for better UX
- **Error Handling**: Graceful error handling and user notifications
- **Code Splitting**: Optimized bundle size with lazy loading

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 14.x or higher
- **npm**: Version 6.x or higher (comes with Node.js)
- **Git**: For cloning the repository

You'll also need:

- A running backend API server (see [API Integration](#api-integration))
- Cloudinary account credentials (for image uploads)
- Firebase project credentials (for authentication)

## 🚀 Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/ajitpal254/3AmshopmeFE.git
   cd 3AmshopmeFE
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory. You will need to configure the following variables:

   **Note:** With Vite, all environment variables must be prefixed with `VITE_` to be exposed to the application.

   - `VITE_API_URL`: The base URL of your backend API server (development)
   - `VITE_API_URL_PROD`: The production API URL
   - `VITE_CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
   - `VITE_CLOUDINARY_UPLOAD_PRESET`: Cloudinary upload preset
   - `VITE_FIREBASE_API_KEY`: Firebase API Key
   - `VITE_FIREBASE_AUTH_DOMAIN`: Firebase Auth Domain
   - `VITE_FIREBASE_PROJECT_ID`: Firebase Project ID
   - `VITE_FIREBASE_STORAGE_BUCKET`: Firebase Storage Bucket
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`: Firebase Messaging Sender ID
   - `VITE_FIREBASE_APP_ID`: Firebase App ID
   - `VITE_FIREBASE_MEASUREMENT_ID`: Firebase Measurement ID

   **Note:** Never commit your `.env` file to version control. The `.env` file is gitignored.

4. **Start the development server**:

   ```bash
   npm start
   # or
   npm run dev
   ```

   The dev server starts in **under 200ms** with Vite! ⚡

## 🏃 Running the Application

### Development Mode

Start the development server with instant hot module replacement (HMR):

```bash
npm start
# or
npm run dev
```

- ⚡ **Lightning-fast startup**: Dev server ready in ~196ms
- 🔥 **Instant HMR**: Changes reflect in <100ms
- The app runs on `http://localhost:3000` by default
- Opens automatically in your browser
- Build errors and warnings appear in both console and browser

### Production Build

Build the app for production deployment:

```bash
npm run build
```

- ⚡ **Fast builds**: Completes in ~3-5 seconds (vs 30-60s with CRA)
- 📦 **Optimized bundles**: Advanced code splitting and tree-shaking
- Creates production build in the `build` folder
- Bundles React in production mode
- Minifies and optimizes all assets with ESBuild
- Includes content hashes for cache busting
- Automatic environment detection (uses production URLs)

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

Serves the production build on a local server for testing.

### Testing

Run the test suite with Vitest:

```bash
npm test
```

- ⚡ **Faster than Jest**: Powered by Vite's transformation pipeline
- Compatible with Jest API
- Watch mode enabled by default
- Integrated with Vite for consistent transforms

### Available Scripts Summary

| Command                      | Description                          |
| ---------------------------- | ------------------------------------ |
| `npm start` or `npm run dev` | Start development server (⚡ ~196ms) |
| `npm run build`              | Create production build (~3-5s)      |
| `npm run preview`            | Preview production build locally     |
| `npm test`                   | Run tests with Vitest                |

### Performance Comparison

| Metric           | Create React App | Vite   | Improvement     |
| ---------------- | ---------------- | ------ | --------------- |
| Dev Server Start | 15-30s           | 196ms  | **100x faster** |
| Build Time       | 30-60s           | 3-5s   | **15x faster**  |
| HMR Update       | 1-2s             | <100ms | **20x faster**  |
| Vulnerabilities  | 2 moderate       | 0      | **100% secure** |

## 📁 Project Structure

```
3AmshopmeFE/
├── public/                 # Static files
│   ├── index.html         # HTML template
│   ├── favicon.ico        # App icon
│   ├── images/            # Static images
│   └── manifest.json      # PWA manifest
├── src/
│   ├── actions/           # Redux action creators
│   │   └── cartActions.js
│   ├── components/        # Reusable React components
│   │   ├── Header.jsx     # Navigation header
│   │   ├── Footer.jsx     # Footer component
│   │   ├── Cart.jsx       # Cart icon component
│   │   ├── Rating.jsx     # Product rating component
│   │   ├── CategoryFilter.jsx
│   │   ├── HeroBanner.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── ProductScreen.jsx
│   ├── constants/         # Redux action constants
│   │   └── cartConstants.js
│   ├── context/           # React Context providers
│   │   ├── AuthContext.js # Authentication context
│   │   └── CartContext.js # Cart context
│   ├── pages/             # Page components (routes)
│   │   ├── HomeScreen.jsx        # Homepage with product listing
│   │   ├── ProductDetails.jsx   # Individual product page
│   │   ├── CartScreen.jsx       # Shopping cart page
│   │   ├── ShippingScreen.jsx   # Shipping address form
│   │   ├── PlaceOrderScreen.jsx # Order review and confirmation
│   │   ├── OrdersScreen.jsx     # Order history
│   │   ├── Login.jsx            # User login
│   │   ├── SignUp.jsx           # User registration
│   │   ├── VendorLogin.jsx      # Vendor login
│   │   ├── VendorSignUp.jsx     # Vendor registration
│   │   ├── VendorDashboard.jsx  # Vendor management
│   │   ├── Admin.jsx            # Admin dashboard
│   │   ├── UserProfile.jsx      # User profile management
│   │   ├── SearchResultScreen.jsx
│   │   ├── ProductListScreen.jsx
│   │   ├── OrderListScreen.jsx
│   │   └── EmailVerification.jsx
│   ├── reducers/          # Redux reducers
│   │   └── cartReducers.js
│   ├── utils/             # Utility functions
│   │   ├── api.js         # Axios API configuration
│   │   ├── cloudinaryUpload.js
│   │   └── firebaseStorage.js
│   ├── App.js             # Main App component with routing
│   ├── App.css            # Global styles
│   ├── index.js           # Entry point
│   ├── index.css          # Base styles
│   ├── store.js           # Redux store configuration
│   └── firebaseconfig.js  # Firebase initialization
├── .env                   # Environment variables (not in git)
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies and scripts
└── README.md             # This file
```

### Key Directories:

- **components/**: Reusable UI components used across pages
- **pages/**: Full-page components that represent different routes
- **actions/ & reducers/**: Redux state management logic
- **context/**: React Context for authentication and cart state
- **utils/**: Helper functions and API configuration

## 📡 API Integration

This frontend application requires a backend API server to function. The API is configured in `src/utils/api.js`.

### Backend API Requirements

The backend should provide the following endpoints:

#### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/google` - Google OAuth

#### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/search` - Search products
- `POST /api/products` - Create product (vendor/admin)
- `PUT /api/products/:id` - Update product (vendor/admin)
- `DELETE /api/products/:id` - Delete product (vendor/admin)

#### Cart

- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove item from cart

#### Orders

- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status (admin)

#### User Profile

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/upload-avatar` - Upload profile picture

### Setting Up the Backend

1. Clone and set up the backend repository
2. Configure the backend to run on port 8080 (or update `VITE_API_URL`)
3. Ensure CORS is configured to allow requests from `http://localhost:3000`
4. Update the `.env` file with your backend URL

### API Request Configuration

The API client is configured with:

- **Base URL**: Automatically switches based on environment:
  - Development: `VITE_API_URL` (local backend)
  - Production: `VITE_API_URL_PROD` (production backend)
- **Environment Detection**: Uses `import.meta.env.MODE` for automatic switching
- **Authentication**: JWT token in Authorization header
- **Request/Response interceptors**: For error handling and logging

Example API usage in the application:

```javascript
// From src/utils/api.js
import api from "../utils/api";

// Making an authenticated request
const fetchProducts = async () => {
  const { data } = await api.get("/products");
  return data;
};

// POST request with data
const createOrder = async (orderData) => {
  const { data } = await api.post("/orders", orderData);
  return data;
};
```

## 📖 Usage Guide

### For Customers

1. **Register/Login**:

   - Click "Sign Up" to create an account
   - Or use "Login" if you already have an account
   - Google Sign-In is also available

2. **Browse Products**:

   - View products on the home page
   - Use search to find specific products
   - Click on a product to view details

3. **Add to Cart**:

   - On product details page, select quantity
   - Click "Add to Cart"
   - Cart icon shows item count

4. **Checkout**:

   - Click cart icon to view cart
   - Review items and quantities
   - Click "Proceed to Checkout"
   - Enter shipping address
   - Review order and confirm

5. **Track Orders**:
   - Go to "My Orders" from profile menu
   - View order status and details

### For Vendors

1. **Vendor Registration**:

   - Navigate to vendor registration page
   - Complete the vendor profile
   - Wait for admin approval (if required)

2. **Manage Products**:
   - Access vendor dashboard
   - Add new products with images and descriptions
   - Edit existing products
   - Monitor inventory levels

### For Admins

1. **Access Admin Panel**:

   - Login with admin credentials
   - Navigate to admin dashboard

2. **Manage Platform**:
   - View all users, products, and orders
   - Approve vendor registrations
   - Manage product listings
   - Handle order disputes

## 🤝 Contributing

We welcome contributions to improve AmShoppee! Here's how you can contribute:

### Getting Started

1. **Fork the repository**:

   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone your fork**:

   ```bash
   git clone https://github.com/YOUR_USERNAME/3AmshopmeFE.git
   cd 3AmshopmeFE
   ```

3. **Create a feature branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes**:

   - Write clean, maintainable code
   - Follow the existing code style
   - Add comments for complex logic
   - Test your changes thoroughly

5. **Commit your changes**:

   ```bash
   git add .
   git commit -m "Add: Brief description of your changes"
   ```

6. **Push to your fork**:

   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**:
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your fork and branch
   - Describe your changes in detail

### Contribution Guidelines

- **Code Style**: Follow the existing code style and conventions
- **Testing**: Ensure all existing tests pass and add tests for new features
- **Documentation**: Update documentation for any changes to functionality
- **Commits**: Write clear, concise commit messages
- **Pull Requests**: Provide detailed descriptions of changes and their purpose

### Areas for Contribution

- Bug fixes and issue resolution
- New features and enhancements
- UI/UX improvements
- Performance optimizations
- Documentation improvements
- Test coverage expansion
- Accessibility improvements

### Reporting Issues

If you find a bug or have a feature request:

1. Check if the issue already exists
2. If not, create a new issue with:
   - Clear, descriptive title
   - Detailed description of the problem/feature
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Environment details (browser, OS, etc.)

## 📄 License

This project is currently not licensed. Please contact the repository owner for usage permissions.

## 📞 Support

For questions or support:

- Open an issue on GitHub
- Contact the maintainers

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/) ⚡ - Next Generation Frontend Tooling
- Migrated from Create React App for better performance
- UI components from [React Bootstrap](https://react-bootstrap.github.io/)
- State management with [Redux](https://redux.js.org/)
- Testing with [Vitest](https://vitest.dev/)
- Icons and images from various open-source resources

---

**Note**: This is a frontend application that requires a backend API to function. Ensure you have the backend server running and properly configured before using this application.

Happy Shopping! 🛍️
