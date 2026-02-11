# 🚀 QUICK START GUIDE - Expense Tracker Microservices

## ⚡ Fast Setup (3 Steps)

### 1️⃣ Install Dependencies

Open 3 terminal windows and run these commands:

**Terminal 1 - Expenses Service:**
```bash
cd expense-tracker-microservices/expenses-service
npm install
cp .env.example .env
```

**Terminal 2 - Analytics Service:**
```bash
cd expense-tracker-microservices/analytics-service
npm install
cp .env.example .env
```

**Terminal 3 - Frontend:**
```bash
cd expense-tracker-microservices/frontend
npm install
cp .env.example .env
```

### 2️⃣ Setup MongoDB

**Option A - Local MongoDB:**
```bash
# If you have MongoDB installed locally, just start it:
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
# Windows: MongoDB service starts automatically

# Edit expenses-service/.env to use:
MONGODB_URI=mongodb://localhost:27017/expense-tracker
```

**Option B - MongoDB Atlas (Free Cloud):**
```bash
# 1. Go to https://www.mongodb.com/cloud/atlas
# 2. Create free account and cluster
# 3. Get connection string
# 4. Edit expenses-service/.env to use:
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/expense-tracker
```

### 3️⃣ Start All Services

Keep the same 3 terminal windows open:

**Terminal 1 - Expenses Service:**
```bash
cd expense-tracker-microservices/expenses-service
npm run dev
```
✅ Should see: "Expenses Service running on port 3001"

**Terminal 2 - Analytics Service:**
```bash
cd expense-tracker-microservices/analytics-service
npm run dev
```
✅ Should see: "Analytics Service running on port 3002"

**Terminal 3 - Frontend:**
```bash
cd expense-tracker-microservices/frontend
npm run dev
```
✅ Should see: "Local: http://localhost:5173"

### 4️⃣ Access the App

Open your browser to: **http://localhost:5173**

## 🎉 That's it!

### Optional: Add Sample Data

```bash
cd expense-tracker-microservices/expenses-service
npm run seed
```

This will add 15 sample expenses across all categories.

## ✅ Verification Checklist

- [ ] MongoDB is running (local or Atlas)
- [ ] Expenses service running on port 3001
- [ ] Analytics service running on port 3002
- [ ] Frontend running on port 5173
- [ ] Browser shows the app at http://localhost:5173
- [ ] Dashboard shows summary cards (even if zeros)
- [ ] Can create a new expense
- [ ] Can edit/delete expenses

## 🐛 Common Issues

**"Cannot connect to database"**
→ Check MongoDB is running and connection string in expenses-service/.env is correct

**"Expenses service is not responding"**
→ Make sure expenses-service is running on port 3001

**"Analytics service error"**
→ Make sure analytics-service is running on port 3002

**Port already in use**
→ Kill the process: `lsof -i :3001` then `kill -9 <PID>`

## 📁 Project Structure

```
expense-tracker-microservices/
├── expenses-service/     # Port 3001 - CRUD operations + MongoDB
├── analytics-service/    # Port 3002 - Summaries (calls expenses-service)
└── frontend/            # Port 5173 - React UI
```

## 🔧 Useful Commands

```bash
# Check health endpoints
curl http://localhost:3001/health
curl http://localhost:3002/health

# Test API manually
curl http://localhost:3001/api/expenses
curl http://localhost:3002/api/summary

# Stop all services
# Press Ctrl+C in each terminal window

# Rebuild frontend for production
cd frontend && npm run build
```

## 📖 Full Documentation

See the complete README.md for:
- Detailed API documentation
- Architecture explanation
- Troubleshooting guide
- Production deployment tips

---

**Need help?** Check the main README.md file for comprehensive documentation.
