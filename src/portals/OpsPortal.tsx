import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

export default function OpsPortal() {
  return (
    <Router>
      <nav className='bg-gray-800 text-white p-4 flex space-x-4'>
        <!-- Add links here -->
      </nav>
      <Routes>
        <Route path='/' element={<Navigate to='/dashboard' />} />
        <!-- Add other routes here -->
      </Routes>
    </Router>
  );
}
