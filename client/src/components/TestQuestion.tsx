import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

interface TestQuestionProps {
  question: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    topic: string;
  };
  questionNumber: number;
  totalQuestions: number;
  onAnswerSubmit: (questionId: string, selectedAnswer: number, correct: boolean) => void;
  timeLimit?: number; // in seconds
}

export default function TestQuestion({ 
  question, 
  questionNumber, 
  totalQuestions, 
  onAnswerSubmit,
  timeLimit = 90 
}: TestQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(timeLimit);
  }, [question.id, timeLimit]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleSubmit();
    }
  }, [timeLeft, showResult]);

  const handleAnswerSelect = (optionIndex: number) => {
    if (!showResult) {
      setSelectedAnswer(optionIndex);
      console.log(`Answer ${optionIndex + 1} selected for question ${questionNumber}`);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer !== null || timeLeft === 0) {
      const answerIndex = selectedAnswer !== null ? selectedAnswer : -1;
      const isCorrect = answerIndex === question.correctAnswer;
      setShowResult(true);
      console.log(`Question ${questionNumber} submitted: ${isCorrect ? 'Correct' : 'Incorrect'}`);
    }
  };

  const handleNext = () => {
    if (showResult) {
      const answerIndex = selectedAnswer !== null ? selectedAnswer : -1;
      const isCorrect = answerIndex === question.correctAnswer;
      onAnswerSubmit(question.id, answerIndex, isCorrect);
    }
  };

  const getOptionStyle = (optionIndex: number) => {
    if (!showResult) {
      return selectedAnswer === optionIndex 
        ? 'border-primary bg-primary/10' 
        : 'border-border hover:border-primary/50 hover-elevate';
    }
    
    if (optionIndex === question.correctAnswer) {
      return 'border-chart-2 bg-chart-2/10 text-chart-2';
    }
    
    if (selectedAnswer === optionIndex && selectedAnswer !== question.correctAnswer) {
      return 'border-destructive bg-destructive/10 text-destructive';
    }
    
    return 'border-muted bg-muted/50 text-muted-foreground';
  };

  const getOptionIcon = (optionIndex: number) => {
    if (!showResult) return null;
    
    if (optionIndex === question.correctAnswer) {
      return <CheckCircle className="h-5 w-5 text-chart-2" />;
    }
    
    if (selectedAnswer === optionIndex && selectedAnswer !== question.correctAnswer) {
      return <XCircle className="h-5 w-5 text-destructive" />;
    }
    
    return null;
  };

  const progressPercentage = (questionNumber / totalQuestions) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4">
      {/* Progress Bar */}
      <div className="mb-4 sm:mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs sm:text-sm font-medium text-muted-foreground" data-testid="text-question-progress">
            Question {questionNumber} of {totalQuestions}
          </span>
          <div className="flex items-center space-x-2">
            <Clock className="h-3 sm:h-4 w-3 sm:w-4 text-muted-foreground" />
            <span 
              className={`text-xs sm:text-sm font-medium ${timeLeft <= 10 ? 'text-destructive' : 'text-muted-foreground'}`}
              data-testid="text-timer"
            >
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
        <Progress value={progressPercentage} className="h-2" data-testid="progress-test" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" data-testid={`badge-topic-${question.id}`}>
              {question.topic}
            </Badge>
          </div>
          <CardTitle className="text-base sm:text-lg md:text-xl leading-relaxed" data-testid={`text-question-${question.id}`}>
            {question.question}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-2 sm:space-y-3 mb-6">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={`w-full p-3 sm:p-4 text-sm sm:text-base text-left rounded-lg border-2 transition-all duration-200 flex items-center justify-between ${getOptionStyle(index)}`}
                data-testid={`button-option-${index}-${question.id}`}
              >
                <span className="flex-1 pr-2">{option}</span>
                {getOptionIcon(index)}
              </button>
            ))}
          </div>
          
          {showResult && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2 text-foreground" data-testid={`text-explanation-title-${question.id}`}>
                Explanation:
              </h4>
              <p className="text-muted-foreground" data-testid={`text-explanation-${question.id}`}>
                {question.explanation}
              </p>
            </div>
          )}
          
          {!showResult ? (
            <Button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="w-full"
              data-testid={`button-submit-answer-${question.id}`}
            >
              Submit Answer
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="w-full"
              data-testid={`button-next-question-${question.id}`}
            >
              {questionNumber === totalQuestions ? 'View Results' : 'Next Question'}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}