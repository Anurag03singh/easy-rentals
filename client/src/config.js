// Configuration for different environments
const config = {
  // Development environment (local)
  development: {
    apiUrl: "http://localhost:8800/api",
    socketUrl: "http://localhost:4000"
  },
  // Production environment
  production: {
    // Use environment variables if available, otherwise fallback to default URLs
    apiUrl: import.meta.env.VITE_API_URL || "https://easy-rentals-api.onrender.com/api",
    socketUrl: import.meta.env.VITE_SOCKET_URL || "https://easy-rentals-socket.onrender.com"
  }
};

// Determine the current environment
const environment = import.meta.env.MODE || "development";

// Export the configuration for the current environment
export default config[environment];