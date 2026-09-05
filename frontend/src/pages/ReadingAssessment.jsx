import React, { useState } from 'react';
import { Mic, Square, Play, CheckCircle } from 'lucide-react';
import './Assessment.css';

export default function ReadingAssessment() {
  const [isRecording, setIsRecording] = useState(false);
  const [completed, setCompleted] = useState(false);

  const sampleText = "The quick brown fox jumps over the lazy dog. It was a sunny day in the magical forest, and all the animals were playing together.";

  const handleRecord = () => {
    setIsRecording(!isRecording);
    if (isRecording) {
      setTimeout(() => setCompleted(true), 1000);
    }
  };

  return (
    <div className="assessment-container">
      <h1>🎙️ Reading Challenge</h1>
      
      {!completed ? (
        <div className="card assessment-card">
          <h2>Read out loud!</h2>
          <div className="reading-text">
            {sampleText.split(' ').map((word, i) => (
              <span key={i} className="word">{word} </span>
            ))}
          </div>

          <div className="recording-controls">
            <button 
              className={`record-btn ${isRecording ? 'recording' : ''}`}
              onClick={handleRecord}
            >
              {isRecording ? <Square size={32} /> : <Mic size={32} />}
            </button>
            <p>{isRecording ? "Listening carefully..." : "Tap the mic to start reading!"}</p>
          </div>
        </div>
      ) : (
        <div className="card success-card">
          <CheckCircle size={64} color="#4ecdc4" />
          <h2>Great Job! 🎉</h2>
          <p>You earned +150 XP and 20 Coins!</p>
          <div className="stats-grid">
            <div className="stat"><span>Accuracy</span><strong>92%</strong></div>
            <div className="stat"><span>Speed</span><strong>45 WPM</strong></div>
          </div>
          <button className="btn btn-primary" onClick={() => setCompleted(false)}>Try Another</button>
        </div>
      )}
    </div>
  );
}
