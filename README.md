# Expense Tracker - Microservices Application

A beginner-friendly microservices web application for tracking personal expenses. Built with React, Node.js, Express, and MongoDB.

## Architecture

This application consists of 3 microservices:

1. **expenses-service** (Port 3001): Handles CRUD operations for expenses using MongoDB
2. **analytics-service** (Port 3002): Provides summary analytics by calling expenses-service
3. **frontend** (Port 5173): React application for the user interface

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB with Mongoose
- **Communication**: REST API over HTTP

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation OR MongoDB Atlas account)
- npm or yarn

## MongoDB Setup

### Option A: Local MongoDB

1. **Install MongoDB** (if not already installed):
   - **macOS**: `brew install mongodb-community`
   - **Windows**: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - **Linux**: Follow [MongoDB installation guide](https://docs.mongodb.com/manual/administration/install-on-linux/)

2. **Start MongoDB service**:
   - **macOS**: `brew services start mongodb-community`
   - **Windows**: MongoDB runs as a service after installation
   - **Linux**: `sudo systemctl start mongod`

3. **Verify MongoDB is running**:
   ```bash
   mongosh
   # Should connect to mongodb://localhost:27017
   ```

### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user with password
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string (should look like):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/expense-tracker
   ```

## Installation & Setup

### 1. Clone/Download the project

```bash
cd expense-tracker-microservices
```

### 2. Setup Expenses Service

```bash
cd expenses-service

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env file with your MongoDB connection string
# For local MongoDB: MONGODB_URI=mongodb://localhost:27017/expense-tracker
# For MongoDB Atlas: MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/expense-tracker
```

### 3. Setup Analytics Service

```bash
cd ../analytics-service

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# The default .env should work as-is (points to localhost:3001)
```

### 4. Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# The default .env should work as-is
```

## Running the Application

You need to run all three services simultaneously. Open 3 separate terminal windows:

### Terminal 1: Expenses Service

```bash
cd expenses-service
npm run dev
```

The service will start on http://localhost:3001

### Terminal 2: Analytics Service

```bash
cd analytics-service
npm run dev
```

The service will start on http://localhost:3002

### Terminal 3: Frontend

```bash
cd frontend
npm run dev
```

The frontend will start on http://localhost:5173

### Access the Application

Open your browser and navigate to: **http://localhost:5173**

## Seeding Sample Data (Optional)

To populate the database with sample expenses for testing:

```bash
cd expenses-service
npm run seed
```

This will create 10 sample expenses across different categories.

## API Documentation

### Expenses Service (http://localhost:3001)

#### Health Check
- **GET** `/health`
- Response: `{ "status": "ok" }`

#### Get All Expenses (with filters)
- **GET** `/api/expenses?from=YYYY-MM-DD&to=YYYY-MM-DD&category=Food`
- Query params (all optional):
  - `from`: Start date (YYYY-MM-DD)
  - `to`: End date (YYYY-MM-DD)
  - `category`: Food | Transport | Shopping | Bills | Other

#### Get Single Expense
- **GET** `/api/expenses/:id`

#### Create Expense
- **POST** `/api/expenses`
- Body:
  ```json
  {
    "title": "Grocery shopping",
    "amount": 45.50,
    "category": "Food",
    "date": "2024-02-11",
    "notes": "Weekly groceries"
  }
  ```

#### Update Expense
- **PUT** `/api/expenses/:id`
- Body: Same as create (all fields optional)

#### Delete Expense
- **DELETE** `/api/expenses/:id`

### Analytics Service (http://localhost:3002)

#### Health Check
- **GET** `/health`

#### Get Summary
- **GET** `/api/summary?from=YYYY-MM-DD&to=YYYY-MM-DD`
- Query params (optional):
  - `from`: Start date
  - `to`: End date
- Response:
  ```json
  {
    "totalAmount": 1234.56,
    "count": 25,
    "byCategory": [
      {
        "category": "Food",
        "total": 450.00,
        "count": 10
      }
    ]
  }
  ```

## Project Structure

```
expenses-service/       # Microservice 1: Expense CRUD operations
├── src/
│   ├── config/        # Database configuration
│   ├── models/        # Mongoose schemas
│   ├── routes/        # Express routes
│   ├── middleware/    # Error handling & validation
│   └── utils/         # Seed script
└── server.js          # Entry point

analytics-service/     # Microservice 2: Analytics & summaries
├── src/
│   ├── config/        # Service configuration
│   ├── services/      # Business logic (calls expenses-service)
│   ├── routes/        # Express routes
│   └── middleware/    # Error handling
└── server.js          # Entry point

frontend/              # React frontend application
├── src/
│   ├── components/    # Reusable React components
│   ├── pages/         # Page components
│   ├── services/      # API client functions
│   └── utils/         # Helper functions
└── vite.config.js     # Vite configuration
```

## Features

✅ Create, read, update, and delete expenses  
✅ Filter expenses by date range and category  
✅ View expense analytics and summaries  
✅ Category-wise breakdown  
✅ Clean and responsive UI  
✅ Input validation and error handling  
✅ Microservices architecture  
✅ RESTful API design  

## Building for Production

### Build Frontend

```bash
cd frontend
npm run build
```

The production-ready files will be in the `dist/` folder.

### Running Backend in Production

For production, you would typically:
1. Set `NODE_ENV=production` in your .env files
2. Use a process manager like PM2
3. Set up proper logging
4. Use environment-specific configuration

Example with PM2:
```bash
npm install -g pm2
pm2 start expenses-service/server.js --name expenses-service
pm2 start analytics-service/server.js --name analytics-service
```

## Troubleshooting

### MongoDB Connection Issues

- **Error**: "MongooseServerSelectionError"
  - Check if MongoDB is running: `mongosh`
  - Verify connection string in expenses-service/.env
  - For Atlas: Check network access settings

### Port Already in Use

- **Error**: "EADDRINUSE"
  - Kill the process using the port:
    - Find: `lsof -i :3001` (macOS/Linux) or `netstat -ano | findstr :3001` (Windows)
    - Kill: `kill -9 <PID>` (macOS/Linux) or `taskkill /PID <PID> /F` (Windows)

### CORS Errors

- Make sure all services are running
- Check that .env files have correct URLs
- CORS is configured in backend services

### Services Can't Communicate

- Verify all services are running on correct ports
- Check EXPENSES_SERVICE_URL in analytics-service/.env
- Check API URLs in frontend/.env

## Development Scripts

### Expenses Service
- `npm run dev` - Start with nodemon (auto-reload)
- `npm start` - Start production server
- `npm run seed` - Seed sample data

### Analytics Service
- `npm run dev` - Start with nodemon
- `npm start` - Start production server

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Contributing

This is a learning project. Feel free to:
- Add new features (e.g., user authentication, categories management)
- Improve UI/UX
- Add tests
- Optimize performance

## License

MIT License - Feel free to use this for learning and development.
