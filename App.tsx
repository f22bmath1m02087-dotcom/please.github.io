import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import GameScreen from './components/GameScreen';
import { GameState, Difficulty } from './types';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>(GameState.Welcome);
    const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Medium);

    const startGame = (selectedDifficulty: Difficulty) => {
        setDifficulty(selectedDifficulty);
        setGameState(GameState.Playing);
    };

    const endGame = () => {
        setGameState(GameState.Welcome);
    };

    const renderContent = () => {
        switch (gameState) {
            case GameState.Playing:
                return <GameScreen difficulty={difficulty} onEndGame={endGame} />;
            case GameState.Welcome:
            default:
                return <WelcomeScreen onStartGame={startGame} />;
        }
    };

    return (
        <main className="bg-slate-900 min-h-screen w-full flex items-center justify-center">
           <div className="w-full">
             {renderContent()}
           </div>
        </main>
    );
};

export default App;