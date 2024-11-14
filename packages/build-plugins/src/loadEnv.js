const dotenv = require("dotenv");
const path = require("path");

// Function to load environment variables
function loadEnv() {
  const env = process.env.NODE_ENV;

  // Load .env.local (always loaded if it exists)
  dotenv.config({ path: path.resolve(process.cwd(), "../../.env.local") });

  // Load environment-specific files (.env.production or .env.development)
  if (env === "production") {
    dotenv.config({
      path: path.resolve(process.cwd(), "../../.env.production.local"),
    });
  } else {
    dotenv.config({
      path: path.resolve(process.cwd(), "../../.env.development.local"),
    });
  }

  // Load .env (fallback)
  dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });

  return { dotenv, path };
}

module.exports = { loadEnv };
