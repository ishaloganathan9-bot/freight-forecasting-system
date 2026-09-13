import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import NewAnalysis from './pages/NewAnalysis';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [analysisData, setAnalysisData] = useState(null);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#071524', color: '#f8fafc' }}>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      {currentPage === 'home' && (
        <Home setCurrentPage={setCurrentPage} />
      )}

      {(currentPage === 'new-analysis' || currentPage === 'newAnalysis' || currentPage === 'analysis') && (
        <NewAnalysis 
          setCurrentPage={setCurrentPage} 
          setAnalysisData={setAnalysisData} 
        />
      )}

      {currentPage === 'dashboard' && (
        <Dashboard 
          setCurrentPage={setCurrentPage} 
          analysisData={analysisData} 
        />
      )}
    </div>
  );
}