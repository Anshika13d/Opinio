import React from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import About from './pages/About'
import Events from './pages/Events'
import Contact from './pages/Contact'
import toast, { Toaster } from 'react-hot-toast';
import ResetPassword from './components/ResetPassword'
import CreateEvent from './pages/CreateEvent'
import Profile from './pages/Profile'
import EventDetails from './pages/EventDetails'
import Footer from './components/Footer'
import Layout from './components/Layout'

function App() {

  return (
    <>
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/event/:eventId" element={<EventDetails />} />
        </Routes>
      </Layout>
    </Router>
    <Toaster />
    </>
  )
}

export default App
