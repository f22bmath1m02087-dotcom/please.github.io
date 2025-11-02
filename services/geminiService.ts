import { GoogleGenAI, Type } from "@google/genai";
import type { ProbabilityQuestion } from '../types';
import { Difficulty } from '../types';

if (!process.env.API_KEY) {
    // In a real application, you'd want to handle this more gracefully.
    // For this project, we assume the key is available.
    console.warn("API_KEY environment variable not set. Using a mock key. The app will use fallback questions.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "mock_key_for_dev" });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        scenario: {
            type: Type.STRING,
            description: "A short, clear description of a probability problem."
        },
        question: {
            type: Type.STRING,
            description: "The specific question the user needs to answer based on the scenario."
        },
        options: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    text: { type: Type.STRING, description: "The answer option text." },
                    isCorrect: { type: Type.BOOLEAN, description: "Indicates if this is the correct answer." }
                },
                required: ["text", "isCorrect"]
            },
            description: "An array of exactly four answer options."
        },
        explanation: {
            type: Type.STRING,
            description: "A detailed but easy-to-understand explanation of why the correct answer is right."
        }
    },
    required: ["scenario", "question", "options", "explanation"]
};


const fallbackQuestion = (difficulty: Difficulty): ProbabilityQuestion => ({
    scenario: "You are rolling a single standard six-sided die.",
    question: `What is the probability of rolling a ${difficulty === Difficulty.Easy ? '4' : 'number greater than 4'}?`,
    options: difficulty === Difficulty.Easy ? [
        { text: "1/6", isCorrect: true },
        { text: "1/3", isCorrect: false },
        { text: "1/2", isCorrect: false },
        { text: "2/3", isCorrect: false },
    ] : [
        { text: "1/6", isCorrect: false },
        { text: "1/3", isCorrect: true },
        { text: "1/2", isCorrect: false },
        { text: "2/3", isCorrect: false },
    ],
    explanation: difficulty === Difficulty.Easy 
        ? "A standard six-sided die has 6 faces (1, 2, 3, 4, 5, 6). Each face has an equal probability of being rolled. There is only one face with a '4'. Therefore, the probability is 1 (favorable outcome) out of 6 (total possible outcomes), which is 1/6."
        : "A standard six-sided die has 6 faces. The numbers greater than 4 are 5 and 6. So there are 2 favorable outcomes. The probability is 2 (favorable outcomes) out of 6 (total possible outcomes), which simplifies to 1/3."
});


export const generateProbabilityScenario = async (difficulty: Difficulty): Promise<ProbabilityQuestion> => {
    try {
        if (!process.env.API_KEY) throw new Error("No API key");

        const prompt = `
        You are a brilliant probability and statistics professor. Your task is to create an engaging probability question for a university-level game.

        Generate a JSON object that adheres to the provided schema.

        Rules for the content:
        1. The 'scenario' should be relatable and interesting. Examples: coin flips, dice rolls, card draws, lottery odds, real-world events.
        2. The 'question' must be unambiguous.
        3. There must be exactly four 'options'.
        4. Exactly one of the 'options' must have 'isCorrect' set to true. The other three must be plausible but incorrect distractors.
        5. The 'explanation' should break down the problem step-by-step.
        6. Adjust the complexity based on the difficulty level: '${difficulty}'.

        Now, generate a new, unique question for the specified difficulty.
      `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonText = response.text.trim();
        const questionData = JSON.parse(jsonText);

        if (!questionData.scenario || !questionData.question || !questionData.options || questionData.options.length !== 4 || !questionData.explanation) {
            console.error("Invalid question format received from API, using fallback.");
            return fallbackQuestion(difficulty);
        }

        const correctAnswers = questionData.options.filter((opt: any) => opt.isCorrect);
        if (correctAnswers.length !== 1) {
            console.warn("API returned a question with not exactly one correct answer. Using fallback.");
            return fallbackQuestion(difficulty);
        }
        
        return questionData as ProbabilityQuestion;
    } catch (error) {
        console.error("Error generating probability scenario:", error);
        return fallbackQuestion(difficulty);
    }
};