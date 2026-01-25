# Weather App - AI Coding Agent Instructions

## Project Overview
A weather application with a Node.js/Express backend. The codebase is in early stages with a minimal backend setup and placeholder environment configuration.

**Key Stack:**
- Runtime: Node.js
- Framework: Express.js v5.2.1
- Key Dependencies: CORS, dotenv, node-fetch

## Architecture

### Backend Structure (`backend/`)
- **server.js**: Main application entry point (currently empty - needs implementation)
- **package.json**: Dependency and script configuration
- **.env**: Environment variables (currently only contains PORT placeholder)

### Design Intent
The architecture follows a simple single-server pattern:
1. Express server setup with CORS enabled for API requests
2. Environment-based configuration via dotenv
3. External API calls via node-fetch (weather data likely sourced externally)

## Essential Workflows

### Running the Backend
```bash
cd backend
npm install  # Install dependencies
PORT=3000 node server.js  # Run with environment variable
```

**Note:** No npm scripts are currently configured for `start` or `dev`. Add these to `package.json` once server.js is implemented.

### Development Patterns
- **Environment Config**: All configuration (PORT, API keys, etc.) goes in `.env` and loads via dotenv
- **Port Configuration**: Read from `process.env.PORT` in server.js
- **CORS**: Already declared as dependency - configure in Express middleware
- **External APIs**: Use node-fetch for HTTP calls to weather data providers

## Code Conventions

### Express Server Setup (Expected Pattern in server.js)
1. Import dependencies (express, cors, dotenv)
2. Load environment variables: `dotenv.config()`
3. Create app: `const app = express()`
4. Apply middleware (CORS, JSON parsing)
5. Define routes for weather endpoints
6. Start server on `process.env.PORT || 5000`

### File Organization
- Keep route handlers modular if multiple endpoint patterns emerge
- Place utility functions (API calls, data transformation) separately from route definitions

## Dependencies & Integration Points

| Dependency | Purpose | Configuration |
|-----------|---------|----------------|
| express | HTTP server framework | Initialize in server.js |
| cors | Cross-origin requests | Middleware setup required |
| dotenv | Environment variables | Call `dotenv.config()` at startup |
| node-fetch | External API calls | For weather data provider integration |

**Critical:** CORS is declared but not configured - add `app.use(cors())` when building routes.

## Known Gaps & Implementation Notes

- **server.js is empty**: Implement Express server initialization
- **No start script**: Add `"start": "node server.js"` and optionally `"dev": "nodemon server.js"` to package.json
- **.env incomplete**: Add API keys and actual PORT value when weather API is chosen
- **No routes defined**: Weather endpoints need implementation
- **No error handling**: Add try-catch and Express error middleware for robustness

## Testing & Quality

- No test framework currently configured
- Consider adding Jest or Mocha when test coverage is needed
- Validate .env required variables at startup

## Quick References

- **Environment Setup**: [backend/.env](backend/.env)
- **Dependencies**: [backend/package.json](backend/package.json)
- **Entry Point**: [backend/server.js](backend/server.js)
