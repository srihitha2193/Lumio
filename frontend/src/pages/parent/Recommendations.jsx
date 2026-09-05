import React from 'react';
import { Lightbulb, BookOpen, Gamepad2, Users, ExternalLink, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import './Recommendations.css';

const aiInsights = [
  {
    id: 1,
    type: 'alert',
    child: 'Emma',
    title: 'Potential Phonological Processing Difficulty',
    description:
      'Emma\'s reading patterns over the past 2 weeks show consistent letter reversal (b/d) and vowel pair confusion ("ou"/"ow"). Her dyslexia risk score has risen from 0.42 to 0.65. We recommend a professional screening.',
    action: 'Schedule a screening with a reading specialist.',
    priority: 'high',
  },
  {
    id: 2,
    type: 'tip',
    child: 'Timmy',
    title: 'Reading Speed Plateau Detected',
    description:
      'Timmy\'s WPM has plateaued around 55 for the past 2 weeks despite consistent practice. Introducing timed-reading games and paired reading sessions can help break through this barrier.',
    action: 'Try the "Speed Reader" game module for 10 minutes daily.',
    priority: 'medium',
  },
  {
    id: 3,
    type: 'success',
    child: 'Timmy',
    title: 'Vocabulary Growth is Exceptional',
    description:
      'Timmy\'s vocabulary score is in the 90th percentile for his age group. He\'s learning approximately 15 new words per week through stories and the Lumio chatbot.',
    action: 'Continue current story difficulty. Consider Level 4 stories.',
    priority: 'low',
  },
];

const practiceActivities = [
  {
    id: 1,
    child: 'Emma',
    title: 'Phonics Focus: "b" vs "d"',
    type: 'game',
    icon: <Gamepad2 size={24} />,
    description: 'A targeted game that helps distinguish mirror-image letters through visual and auditory cues.',
    duration: '10 min/day',
    frequency: 'Daily for 2 weeks',
  },
  {
    id: 2,
    child: 'Emma',
    title: 'Vowel Pair Stories',
    type: 'story',
    icon: <BookOpen size={24} />,
    description: 'AI-generated short stories that emphasize "ou", "ea", and "ow" vowel pairs in context.',
    duration: '15 min',
    frequency: '3 times/week',
  },
  {
    id: 3,
    child: 'Timmy',
    title: 'Speed Reading Challenge',
    type: 'game',
    icon: <Gamepad2 size={24} />,
    description: 'Timed passages with gradual speed increase to push past the current WPM plateau.',
    duration: '10 min',
    frequency: 'Daily',
  },
  {
    id: 4,
    child: 'Timmy',
    title: 'Advanced Vocabulary Builder',
    type: 'story',
    icon: <BookOpen size={24} />,
    description: 'Level 4 stories with richer vocabulary, contextualized definitions, and comprehension checks.',
    duration: '20 min',
    frequency: '4 times/week',
  },
];

const externalResources = [
  {
    id: 1,
    title: 'International Dyslexia Association',
    description: 'Comprehensive resource for understanding dyslexia signs, screening tools, and intervention strategies.',
    url: '#',
  },
  {
    id: 2,
    title: 'Reading Rockets – Parent Tips',
    description: 'Evidence-based tips for parents to support early reading at home.',
    url: '#',
  },
  {
    id: 3,
    title: 'Paired Reading Technique Guide',
    description: 'Step-by-step guide on how to do paired reading sessions with your child at home.',
    url: '#',
  },
];

export default function Recommendations() {
  const getInsightIcon = (type) => {
    if (type === 'alert') return <AlertCircle size={22} />;
    if (type === 'success') return <CheckCircle size={22} />;
    return <Lightbulb size={22} />;
  };

  return (
    <div className="rec-container">
      <header className="rec-header">
        <div>
          <h1>Recommendations</h1>
          <p className="rec-subtitle">AI-powered insights and personalized learning suggestions for your children.</p>
        </div>
      </header>

      {/* AI Insights */}
      <section className="rec-section">
        <h2 className="rec-section-title">🧠 AI Insights</h2>
        <div className="rec-insights-list">
          {aiInsights.map((insight) => (
            <div key={insight.id} className={`rec-insight-card rec-insight-${insight.type}`}>
              <div className="rec-insight-header">
                <div className={`rec-insight-icon rec-icon-${insight.type}`}>
                  {getInsightIcon(insight.type)}
                </div>
                <div>
                  <h3>{insight.title}</h3>
                  <span className="rec-insight-child">For {insight.child}</span>
                </div>
                <span className={`rec-priority rec-priority-${insight.priority}`}>
                  {insight.priority}
                </span>
              </div>
              <p className="rec-insight-desc">{insight.description}</p>
              <div className="rec-insight-action">
                <strong>Suggested Action:</strong> {insight.action}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Practice Activities */}
      <section className="rec-section">
        <h2 className="rec-section-title">📋 Recommended Activities</h2>
        <div className="rec-activities-grid">
          {practiceActivities.map((act) => (
            <div key={act.id} className="rec-activity-card">
              <div className="rec-act-top">
                <div className="rec-act-icon">{act.icon}</div>
                <span className={`rec-act-type rec-type-${act.type}`}>{act.type}</span>
              </div>
              <h3>{act.title}</h3>
              <span className="rec-act-child">For {act.child}</span>
              <p>{act.description}</p>
              <div className="rec-act-meta">
                <span><Clock size={14} /> {act.duration}</span>
                <span>{act.frequency}</span>
              </div>
              <button className="btn btn-primary rec-act-btn">Assign Activity</button>
            </div>
          ))}
        </div>
      </section>

      {/* External Resources */}
      <section className="rec-section">
        <h2 className="rec-section-title">📚 Helpful Resources</h2>
        <div className="rec-resources-list">
          {externalResources.map((res) => (
            <a key={res.id} href={res.url} className="rec-resource-card" target="_blank" rel="noreferrer">
              <div>
                <h3>{res.title}</h3>
                <p>{res.description}</p>
              </div>
              <ExternalLink size={20} className="rec-resource-link-icon" />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
