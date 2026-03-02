import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-2xl font-bold text-purple-700">LinkedPost</h2>
            <p className="text-gray-500 text-sm mt-1">Connect, Share, Inspire.</p>
          </div>

          {/* Links */}
          <div className="flex gap-6">
            <Link to="/" className="text-gray-600 hover:text-purple-700 transition font-medium">Home</Link>
            <Link to="/profile" className="text-gray-600 hover:text-purple-700 transition font-medium">Profile</Link>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4">
            <a href="#" className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center hover:bg-purple-200 transition">
              <svg className="w-4 h-4 text-purple-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center hover:bg-purple-200 transition">
              <svg className="w-4 h-4 text-purple-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
              </svg>
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center hover:bg-purple-200 transition">
              <svg className="w-4 h-4 text-purple-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} LinkedPost. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
