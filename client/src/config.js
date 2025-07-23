// Configuration for different environments
const config = {
  // Development environment (local)
  development: {
    apiUrl: "http://localhost:8800/api",
    socketUrl: "http://localhost:4000"
  },
  // Production environment
  production: {
    // For Vercel deployment, API and socket are on the same domain
    apiUrl: "/api",
    socketUrl: window.location.origin,
    socketPath: "/api/socketio"
  }
};

// Determine the current environment
const environment = import.meta.env.MODE || "development";

// Export the configuration for the current environment
export default config[environment];