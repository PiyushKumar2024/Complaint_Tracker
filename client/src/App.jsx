import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<div>Welcome to Complaint Tracker Frontend</div>} />
      </Routes>
    </div>
  );
}

export default App;
