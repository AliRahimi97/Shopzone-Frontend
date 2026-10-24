# ShopZone Frontend

React storefront and admin panel for **ShopZone** e-commerce.

## Overview

Modern, responsive web UI for browsing products, managing a shopping cart, placing orders, using a wishlist, and administering products, orders, and users. Communicates with the ShopZone Spring Boot API using JWT authentication.

## Tech Stack

- React
- React Router
- Tailwind CSS
- Axios
- Context API (Auth, Cart, Wishlist, Products)
- Swiper (product carousels and image galleries)

## Features

### Customer storefront

- Home page: hero, deals, hot picks, brand promos, category navigation
- Product detail page with multi-image gallery
- Search results
- Category and brand product listings
- Shopping cart (add, update quantity, remove)
- Checkout and order confirmation
- Order history and order detail
- Wishlist
- User profile
- Browse catalog **without login**; cart / checkout / wishlist require authentication

### Admin panel

- Dashboard overview
- Product management (create, edit, images)
- Order management and status updates
- User list

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm
- Running ShopZone API: [shopzone-backend](https://github.com/AliRahimi97/shopzone-backend) (default `http://localhost:8080`)

### Install and run

```bash
npm install
npm start
```

App URL (default):
http://localhost:3000

## API connection
The frontend expects the backend at http://localhost:8080 unless you change the Axios base URL and image URL helpers.

## Demo flow

1. Open the store without logging in → browse products and categories
2. Register or log in as a customer → add items to cart → checkout → view orders
3. Log in as an admin → manage products and orders in the admin area

## Related repository
Backend (Spring Boot API): shopzone-backend


## Author
Ali Rahimi
