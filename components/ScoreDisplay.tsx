import React from 'react';

interface ScoreDisplayProps {
    score: number;
    questionsAnswered: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, questionsAnswered }) => {
    return (
        <div className="bg-slate-800 p-4 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-bold text-teal-400">SCORE</h2>
            <p className="text-4xl font-mono font-extrabold text-white">{score} / {questionsAnswered}</p>
        </div>
    );
};

export default ScoreDisplay;