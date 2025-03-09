import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ContextProviders from './components/contexts/ContextProviders';
import GlobalScript from './components/common/GlobalScript';

import Home from './routes/Home';
import UserSignupDetailsPage from './routes/UserSignupDetailsPage';
import TransactionResult from './routes/TransactionResult';

import './App.css'

function App() {

  return (
    <Router>
      <ContextProviders>
        <GlobalScript>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:username" element={<Home />} />
            <Route path="/:username/:memoryId" element={<Home />} />
            <Route path="/signup-details" element={<UserSignupDetailsPage />} />
            <Route path="/transaction-result" element={<TransactionResult />} />
          </Routes>
        </GlobalScript>
      </ContextProviders>
    </Router>
  );
}

export default App;
