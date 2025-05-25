import React from 'react';
import ProgressTracker from './components/ProgressTracker';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Lecture Progress Tracker</h1>
        <p>Track your real learning progress with unique watch time tracking</p>
      </header>
      <main className="app-main">
        <ProgressTracker videoId="lecture1" />
      </main>
    </div>
  );
}

export default App;
