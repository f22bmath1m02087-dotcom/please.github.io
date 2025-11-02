import React from 'react';
import { Difficulty } from '../types';

interface WelcomeScreenProps {
    onStartGame: (difficulty: Difficulty) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartGame }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-sky-500">
                Probability Ace
            </h1>
            <p className="text-slate-300 text-lg md:text-xl max-w-2xl mb-8">
                Test your intuition and knowledge of probability. An AI will generate unique scenarios for you to solve. Choose your difficulty and begin!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                 <button 
                    onClick={() => onStartGame(Difficulty.Easy)}
                    className="px-8 py-4 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105"
                >
                    Easy
                </button>
                 <button 
                    onClick={() => onStartGame(Difficulty.Medium)}
                    className="px-8 py-4 bg-yellow-500 text-white font-bold rounded-lg shadow-lg hover:bg-yellow-600 transition-transform transform hover:scale-105"
                >
                    Medium
                </button>
                 <button 
                    onClick={() => onStartGame(Difficulty.Hard)}
                    className="px-8 py-4 bg-red-600 text-white font-bold rounded-lg shadow-lg hover:bg-red-700 transition-transform transform hover:scale-105"
                >
                    Hard
                </button>
            </div>
        </div>
    );
};

export default WelcomeScreen;