import React from 'react'
import {createRoot} from "react-dom/client"
import {APIProvider} from '@vis.gl/react-google-maps'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './routes/Home';

function App() {
  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAP_ID as string} onLoad={() => console.log('Maps API has loaded.')}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </APIProvider>
  );
}

export default App
