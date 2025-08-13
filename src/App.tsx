import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components';
import { UploadPage, CameraPage } from './pages';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-vh-100">
        <Navigation />
        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/camera" element={<CameraPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
