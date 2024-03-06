import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AdminPage from './pages/AdminPage.jsx'
import LoginPage from './pages/LoginPage.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <Router>
        <Routes>
          <Route path='/' element={<App />} />
          <Route path='/admin' element={<AdminPage />} />
          <Route path='/login' element={<LoginPage />} />
        </Routes>
      </Router>
  </React.StrictMode>,
)
