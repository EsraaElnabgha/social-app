import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../Components/Footer'
import NavbarComponent from '../Components/Navbar'

export default function MainLayout() {
  return (
    <div>
      <NavbarComponent />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
