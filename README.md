# keylab;

Keylab is an open-source keyboard e-commerce platform built using Tailwind, ReactJS and Go. This project was built by a group of 9 students as part of the Aston University Computer Science Team Project. 

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Features](#features)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Contributors](#contributors)

## Overview

Keylab is a comprehensive e-commerce solution focused on mechanical keyboards and accessories. The platform enables users to browse products, manage their shopping cart, process payments, and track orders, while providing administrators with inventory and user management capabilities.

## Tech Stack

### Frontend
- **React**: UI library for building component-based interfaces
- **TypeScript**: Adds static typing to enhance code quality and developer experience
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Vite**: Next-generation frontend build tool for faster development
- **React Router**: Declarative routing for React applications

### Backend
- **Go (Golang)**: High-performance backend language
- **GORM**: ORM library for database interactions
- **JWT**: For authentication and authorization

### Database
- **MariaDB**: Relational database for storing product, user, and order information

### DevOps
- **Docker**: Containerization for consistent development and deployment environments
- **Docker Compose**: Multi-container Docker applications

## Architecture

Keylab follows a microservices architecture with a clear separation between the frontend and backend:

1. **Client Layer**: React-based Single Page Application (SPA) that communicates with the backend via RESTful APIs
2. **API Layer**: Go-based services handling business logic, authentication, and database operations
3. **Data Layer**: MariaDB database with optimized schema for e-commerce operations

## Features

- **User Authentication**: Secure login, registration, cookies, and account management
- **Product Browsing**: Search, filter, and sort keyboard products by category
- **Product Details**: View detailed product information and specifications, leave reviews and ratings
- **Shopping Cart**: Add, remove, and modify items before checkout
- **Checkout Process**: Seamless address and payment processing
- **Admin Dashboard**: Inventory and user management, order processing, and analytics
- **Responsive Design**: Mobile-first approach ensuring compatibility across devices of all sizes

## Project Structure

(project structure is simplified)

```
keylab/
├── client/                # Frontend React application
│   ├── public/            # Static assets
│   ├── src/               # React components and logic
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API integration services and RESTful tests
│   │   ├── hooks/         # Custom React hooks for state management
│   │   ├── layouts/       # Page layouts for consistent design
│   │   ├── types/         # TypeScript type definitions
│   │   └── lib/           # Helper functions
│   ├── index.html         # HTML entry point
│   ├── tailwind.config.js # Tailwind CSS configuration
│   ├── tsconfig.json      # TypeScript configuration
│   ├── vite.config.js     # Vite configuration
│   ├── .prettierrc        # Prettier configuration
│   ├── eslint.config.js   # ESLint configuration
│   └── package.json       # Frontend dependencies
├── server/                # Backend Go application
│   ├── database/          # Database migrations and models
│   ├── handlers/          # Request handlers for API endpoints
│   ├── middleware/        # Middleware functions for authentication and logging
│   ├── public/            # Static assets
│   ├── repositories/      # Data access layer for interacting with the database
│   ├── routes/            # API route definitions
│   ├── utils/             # Utility functions
│   ├── main.go            # Application entry point
│   ├── go.mod             # Go module dependencies
│   └── .env               # Environment variables
├── docker-compose.yml     # Docker configuration
└── README.md              # Project documentation
```

## Setup

### Prerequisites

- **Node.js** (v16 or later)
- **Go** (v1.23.3 or later) 
- **MariaDB** 
- **Docker** (for Docker setup)

### Docker Setup

1. Clone the repository:

```bash
git clone https://github.com/unchihugo/keylab.git
cd keylab
```

2. Copy the environment file and configure the environment variables:

```bash
cd server
cp .env.example .env  # Linux
copy .env.example .env  # Windows
# Update the .env file with your database credentials
```

3. Start application with Docker

```bash
docker-compose up --build
```

## API Documentation

The backend API follows RESTful principles with the following main endpoints:

- **Authentication**: `/api/auth/*` - User registration, login, token refresh
- **Categories**: `/api/categories/*` - Product categorization
- **Products**: `/api/products/*` - Product listing, details, filtering
    - **Product Reviews**: `/api/products/:product_slug/reviews` - Product reviews and ratings
- **Cart**: `/api/cart/*` - Shopping cart operations

## Database Schema

The database includes the following core tables:

- **Address**: User address information
- **CartItems**: Shopping cart items
- **ContactUsRequest**: User contact form submissions
- **Discount**: Discount codes for purchases
    - **DiscountItems**: Discount code applicability to products
- **Order**: Order information
    - **OrderedItems**: Products ordered in an order
- **Permission**: User permissions
- **Product**: Product information
    - **ProductCategory**: Product categorization
    - **ProductImages**: Product images
    - **ProductReviews**: Product reviews and ratings
- **Role**: User roles
- **User**: User information

## Contributors

- [Michael Tilley](https://github.com/michaeltukdev) - Fullstack Engineer (Backend Lead)
- [Hugo Li](https://github.com/unchihugo) - Fullstack Engineer (Frontend Lead) & UI Designer
- [Mohammed](https://github.com/Baburi19) - Frontend Engineer 
- [Hafsah](https://github.com/Artichaze1) - Frontend Engineer
- [Finlay](https://github.com/fxnners) - Frontend Engineer
- [Hardik](https://github.com/hg03-cloud) - Backend Engineer & Database
- [Aisha](https://github.com/aishafh3) - Fullstack Engineer & Database
- [Rue](https://github.com/ruwaida11) - Fullstack Engineer & Database
- [Amina](https://github.com/amina3bdul) - Frontend Engineer & UI Designer