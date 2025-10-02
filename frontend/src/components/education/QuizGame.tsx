import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMockData } from '../../hooks/useMockData';
import { CheckCircleIcon, XCircleIcon } from '../IconComponents';

const QuizGame = () => {
  const { quizQuestions } = useMockData();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleAnswerSelect = (option: string) => {
    if (selectedAnswer) return; // Prevent changing answer

    setSelectedAnswer(option);
    const correct = option === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    if (correct) {
      setScore(prev => prev + 1);
    }
  };
  
  const handleNext = () => {
    if(currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
    } else {
        setShowResults(true);
    }
  }
  
  const handleRestart = () => {
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setScore(0);
      setShowResults(false);
  }

  if (showResults) {
    return (
        <div className="text-center p-4">
            <h3 className="font-orbitron text-2xl font-bold text-[var(--accent-yellow)]">Quiz Complete!</h3>
            <p className="text-lg text-[var(--text-light)] my-4">You scored {score} out of {quizQuestions.length}!</p>
            <button
                onClick={handleRestart}
                className="w-full bg-[var(--accent-purple)] hover:bg-[var(--accent-lavender)] hover:text-black font-bold py-3 px-4 rounded-lg transition-all duration-300"
            >
                Play Again
            </button>
        </div>
    )
  }

  return (
    <div className="p-4">
      <h4 className="font-bold text-lg text-white mb-4 h-16">{currentQuestion.question}</h4>
      <div className="space-y-3">
        {currentQuestion.options.map((option) => {
          const isSelected = selectedAnswer === option;
          const isCorrectAnswer = option === currentQuestion.correctAnswer;
          
          let buttonClass = "w-full text-left p-3 rounded-lg transition-all duration-200 border-2 border-transparent ";
          if (selectedAnswer) {
              if (isCorrectAnswer) {
                  buttonClass += "bg-green-500/30 border-green-500 text-white";
              } else if (isSelected) {
                  buttonClass += "bg-red-500/30 border-red-500 text-white";
              } else {
                  buttonClass += "bg-black/20 text-gray-400";
              }
          } else {
              buttonClass += "bg-black/20 hover:bg-black/40 hover:border-[var(--accent-purple)] text-white";
          }
          
          return (
            <button key={option} onClick={() => handleAnswerSelect(option)} className={buttonClass} disabled={!!selectedAnswer}>
              {option}
            </button>
          )
        })}
      </div>
      
      <AnimatePresence>
      {selectedAnswer && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-lg bg-black/30"
          >
              <div className="flex items-center gap-2">
                {isCorrect ? <CheckCircleIcon className="w-6 h-6 text-green-400"/> : <XCircleIcon className="w-6 h-6 text-red-400"/>}
                <p className={`font-bold text-lg ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                    {isCorrect ? "Correct!" : "Not Quite!"}
                </p>
              </div>
              <p className="text-sm text-[var(--text-muted)] mt-2">{currentQuestion.explanation}</p>
              <button 
                onClick={handleNext}
                className="w-full mt-4 bg-[var(--accent-purple)] hover:bg-[var(--accent-lavender)] hover:text-black font-bold py-2 px-4 rounded-lg transition-all duration-300"
              >
                {currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </button>
          </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default QuizGame;