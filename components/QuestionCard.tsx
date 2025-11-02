import React from 'react';
import type { ProbabilityQuestion, AnswerOption } from '../types';

interface QuestionCardProps {
    question: ProbabilityQuestion;
    onAnswerSelect: (option: AnswerOption) => void;
    selectedAnswer: AnswerOption | null;
    showFeedback: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswerSelect, selectedAnswer, showFeedback }) => {

    const getButtonClass = (option: AnswerOption) => {
        if (!showFeedback) {
            return selectedAnswer?.text === option.text
                ? 'bg-sky-500 ring-2 ring-sky-300'
                : 'bg-slate-700 hover:bg-slate-600';
        }

        if (option.isCorrect) {
            return 'bg-green-600 ring-2 ring-green-300';
        }
        
        if (selectedAnswer?.text === option.text && !option.isCorrect) {
            return 'bg-red-600 ring-2 ring-red-400';
        }

        return 'bg-slate-700 opacity-60';
    };
    
    return (
        <div className="w-full max-w-2xl mx-auto bg-slate-800 rounded-xl shadow-2xl p-6 md:p-8 space-y-6">
            <div>
                <p className="text-sm font-semibold text-teal-400 uppercase tracking-wider">Scenario</p>
                <p className="mt-1 text-lg text-slate-200">{question.scenario}</p>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-white">{question.question}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => onAnswerSelect(option)}
                        disabled={showFeedback}
                        className={`p-4 rounded-lg text-left transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-teal-400 disabled:cursor-not-allowed disabled:transform-none disabled:opacity-100 ${getButtonClass(option)}`}
                    >
                        <span className="text-white font-medium">{option.text}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuestionCard;