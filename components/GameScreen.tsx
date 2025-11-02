import React, { useState, useEffect, useCallback } from 'react';
import { generateProbabilityScenario } from '../services/geminiService';
import type { ProbabilityQuestion, AnswerOption } from '../types';
import { Difficulty } from '../types';
import QuestionCard from './QuestionCard';
import LoadingSpinner from './LoadingSpinner';
import ScoreDisplay from './ScoreDisplay';

interface GameScreenProps {
    difficulty: Difficulty;
    onEndGame: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ difficulty, onEndGame }) => {
    const [currentQuestion, setCurrentQuestion] = useState<ProbabilityQuestion | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<AnswerOption | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const [score, setScore] = useState(0);
    const [questionsAnswered, setQuestionsAnswered] = useState(0);

    const fetchNextQuestion = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setSelectedAnswer(null);
        setShowFeedback(false);
        try {
            const question = await generateProbabilityScenario(difficulty);
            setCurrentQuestion(question);
        } catch (err) {
            setError('Failed to load a new question. Please try again later.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [difficulty]);

    useEffect(() => {
        fetchNextQuestion();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAnswerSelect = (option: AnswerOption) => {
        if (!showFeedback) {
            setSelectedAnswer(option);
        }
    };

    const handleSubmit = () => {
        if (!selectedAnswer) return;

        const correct = selectedAnswer.isCorrect;
        setIsCorrect(correct);
        if (correct) {
            setScore(prev => prev + 1);
        }
        setQuestionsAnswered(prev => prev + 1);
        setShowFeedback(true);
    };

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 space-y-8">
            <div className="w-full max-w-2xl flex justify-between items-center">
                <ScoreDisplay score={score} questionsAnswered={questionsAnswered} />
                <button onClick={onEndGame} className="px-6 py-2 bg-slate-700 text-white font-semibold rounded-lg shadow-md hover:bg-slate-600 transition">
                    End Game
                </button>
            </div>

            {isLoading && <div className="min-h-[400px] flex items-center justify-center"><LoadingSpinner /></div>}
            {error && <p className="text-red-400 text-center">{error}</p>}
            
            {!isLoading && currentQuestion && (
                <>
                    <QuestionCard 
                        question={currentQuestion}
                        onAnswerSelect={handleAnswerSelect}
                        selectedAnswer={selectedAnswer}
                        showFeedback={showFeedback}
                    />

                    {showFeedback && (
                        <div className="w-full max-w-2xl bg-slate-800 rounded-xl shadow-2xl p-6 mt-4 animate-fade-in">
                            <h3 className={`text-2xl font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                {isCorrect ? 'Correct!' : 'Incorrect!'}
                            </h3>
                            <p className="mt-2 text-slate-300">{currentQuestion.explanation}</p>
                        </div>
                    )}
                    
                    <div className="w-full max-w-2xl flex justify-end mt-4">
                        {!showFeedback ? (
                            <button
                                onClick={handleSubmit}
                                disabled={!selectedAnswer}
                                className="px-8 py-3 bg-teal-500 text-white font-bold rounded-lg shadow-lg hover:bg-teal-600 transition disabled:bg-slate-600 disabled:cursor-not-allowed"
                            >
                                Submit Answer
                            </button>
                        ) : (
                            <button
                                onClick={fetchNextQuestion}
                                className="px-8 py-3 bg-sky-500 text-white font-bold rounded-lg shadow-lg hover:bg-sky-600 transition"
                            >
                                Next Question
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default GameScreen;