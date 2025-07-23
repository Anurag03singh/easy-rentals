// Configuration for different environments
const config = {
  // Development environment (local)
  development: {
    apiUrl: "http://localhost:8800/api",
    socketUrl: "http://localhost:4000"
  },
  // Production environment
  production: {
    apiUrl: "https://easy-rentals-api.vercel.app/api", // Update this with your actual API URL once deployed
    socketUrl: "https://easy-rentals-socket.vercel.app" // Update this with your actual Socket URL once deployed
  }
};

// Determine the current environment
const environment = import.meta.env.MODE || "development";

// Export the configuration for the current environment
export default config[environment];