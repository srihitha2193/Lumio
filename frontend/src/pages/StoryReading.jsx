import React from 'react';
import './Story.css';

export default function StoryReading() {
  const stories = [
    { id: 1, title: "The Space Dog", level: "Level 1", img: "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=300&h=200&fit=crop" },
    { id: 2, title: "Magic Treehouse", level: "Level 2", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=200&fit=crop" },
    { id: 3, title: "Dragon's Gold", level: "Level 3", img: "https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?w=300&h=200&fit=crop" },
  ];

  return (
    <div className="story-container">
      <h1>📚 Story Time</h1>
      
      <div className="story-grid">
        {stories.map(story => (
          <div key={story.id} className="card story-card">
            <img src={story.img} alt={story.title} />
            <div className="story-info">
              <span className="badge">{story.level}</span>
              <h3>{story.title}</h3>
              <button className="btn btn-primary">Read Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
