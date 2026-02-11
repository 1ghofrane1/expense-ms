/**
 * App Component
 * 
 * Main application component that manages global state and routing
 */

import { useState, useEffect } from 'react'
import './App.css'
import Home from './pages/Home'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1>💰 Expense Tracker</h1>
          <p className="subtitle">Microservices Architecture Demo</p>
        </div>
      </header>
      
      <main className="app-main">
        <Home />
      </main>
      
      <footer className="app-footer">
        <div className="container">
          <p>Built with React, Node.js, Express, and MongoDB</p>
          <p className="service-status">
            <span className="service-badge">Expenses Service: 3001</span>
            <span className="service-badge">Analytics Service: 3002</span>
            <span className="service-badge">Frontend: 5173</span>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
