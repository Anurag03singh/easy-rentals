# Easy Rentals - Real Estate Application

A full-stack real estate application for property listings, rentals, and sales.

## Features

- User authentication and profile management
- Property listings with detailed information
- Search and filter properties by various criteria
- Interactive map integration
- Real-time chat between users
- Save favorite properties
- Responsive design for all devices

## Tech Stack

### Frontend
- React.js
- React Router
- SCSS for styling
- Leaflet for maps
- Socket.io client for real-time communication
- Zustand for state management

### Backend
- Express.js
- MongoDB with Prisma ORM
- JWT authentication
- Socket.io for real-time communication

## Getting Started

### Prerequisites
- Node.js
- MongoDB

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/easy-rentals.git
cd easy-rentals
```

2. Install dependencies
```
# Install API dependencies
cd api
npm install

# Install client dependencies
cd ../client
npm install

# Install socket dependencies
cd ../socket
npm install
```

3. Set up environment variables
- Create a `.env` file in the `api` directory with the following:
```
DATABASE_URL="mongodb://localhost:27017/estatedb"
CLIENT_URL="http://localhost:5173"
```

4. Run the application
```
# Run the API server
cd api
npm run dev

# Run the client
cd ../client
npm run dev

# Run the socket server
cd ../socket
npm run dev
```

Or use the provided batch script:
```
run-project.bat
```

## Screenshots

(Screenshots will be added here)

## License

MIT