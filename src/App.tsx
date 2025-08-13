import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components';
import { UploadPage, CameraPage, RealtimeDetectionPage } from './pages';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-vh-100">
        <Navigation />
        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/camera" element={<CameraPage />} />
          <Route path="/realtime" element={<RealtimeDetectionPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
