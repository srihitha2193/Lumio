import React from 'react';
import './Games.css';

export default function LearningGames() {
  const games = [
    { id: 1, title: "Word Match", desc: "Match words to their pictures!", color: "#ff9a9e" },
    { id: 2, title: "Spelling Bee", desc: "Catch the falling letters!", color: "#a1c4fd" },
    { id: 3, title: "Phonics Ninja", desc: "Slice the correct sounds!", color: "#84fab0" }
  ];

  return (
    <div className="games-container">
      <h1>🎮 Learning Games</h1>
      
      <div className="games-grid">
        {games.map(game => (
          <div key={game.id} className="card game-card" style={{ borderTop: `10px solid ${game.color}` }}>
            <div className="game-icon" style={{ backgroundColor: game.color }}></div>
            <h3>{game.title}</h3>
            <p>{game.desc}</p>
            <button className="btn">Play (+50 XP)</button>
          </div>
        ))}
      </div>
    </div>
  );
}
