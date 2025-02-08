import React from 'react'
import {createRoot} from "react-dom/client"
import {APIProvider} from '@vis.gl/react-google-maps'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import ContextProviders from './components/contexts/ContextProviders';

function App() {
  return (
    <ContextProviders>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </ContextProviders>
  );
}

export default App;
