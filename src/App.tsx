import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ContextProviders from './components/contexts/ContextProviders';
import GlobalScript from './components/common/GlobalScript';

import Home from './routes/Home';
import UserSignupDetailsPage from './routes/UserSignupDetailsPage';

import './App.css'

function App() {

  return (
    <Router>
      <ContextProviders>
        <GlobalScript>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup-details" element={<UserSignupDetailsPage />} />
          </Routes>
        </GlobalScript>
      </ContextProviders>
    </Router>
  );
}

export default App;
