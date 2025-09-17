import { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import Header from '@/components/Header';
import TestQuestion from '@/components/TestQuestion';
import TestResults from '@/components/TestResults';
import { ThemeProvider } from '@/components/ThemeProvider';
import { TestSession, TestQuestion as TestQuestionType } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// todo: remove mock functionality - replace with real data from backend
const mockQuestions: Record<string, TestQuestionType[]> = {
  'acca': [
    {
      id: 'acca-q1',
      question: 'Which of the following is the primary purpose of financial statements according to ACCA standards?',
      options: [
        'To provide tax information to government authorities',
        'To provide information about financial position, performance, and cash flows',
        'To determine employee compensation packages',
        'To calculate insurance premiums for the business'
      ],
      correctAnswer: 1,
      explanation: 'According to ACCA standards, the primary purpose of financial statements is to provide information about the financial position, financial performance, and cash flows of an entity that is useful to a wide range of users in making economic decisions.',
      topic: 'Financial Reporting'
    },
    {
      id: 'acca-q2',
      question: 'What is the fundamental accounting equation?',
      options: [
        'Revenue - Expenses = Profit',
        'Assets = Liabilities + Equity',
        'Cash In - Cash Out = Net Cash Flow',
        'Sales - Cost of Sales = Gross Profit'
      ],
      correctAnswer: 1,
      explanation: 'The fundamental accounting equation is Assets = Liabilities + Equity. This equation must always balance and forms the foundation of double-entry bookkeeping.',
      topic: 'Accounting Fundamentals'
    }
  ],
  'hesi-a2': [
    {
      id: 'hesi-q1',
      question: 'Which part of the digestive system is primarily responsible for nutrient absorption?',
      options: [
        'Stomach',
        'Large intestine',
        'Small intestine',
        'Esophagus'
      ],
      correctAnswer: 2,
      explanation: 'The small intestine is the primary site of nutrient absorption due to its extensive surface area created by villi and microvilli.',
      topic: 'Anatomy & Physiology'
    }
  ]
};

const courseNames: Record<string, string> = {
  'acca': 'ACCA',
  'hesi-a2': 'HESI A2',
  'ati-teas': 'ATI TEAS 7',
  'nclex-rn': 'NCLEX RN',
  'nclex-pn': 'NCLEX PN'
};

export default function TestPage() {
  const [match, params] = useRoute('/test/:courseId');
  const [, setLocation] = useLocation();
  const [testSession, setTestSession] = useState<TestSession | null>(null);
  const [loading, setLoading] = useState(true);

  const courseId = params?.courseId || '';
  const courseName = courseNames[courseId] || courseId.toUpperCase();

  useEffect(() => {
    if (match && courseId) {
      console.log('Starting test for course:', courseId);
      initializeTest(courseId);
    }
  }, [match, courseId]);

  const initializeTest = (courseId: string) => {
    const questions = mockQuestions[courseId] || [];
    
    if (questions.length === 0) {
      console.log('No questions found for course:', courseId);
      setLoading(false);
      return;
    }

    const session: TestSession = {
      courseId,
      questions,
      currentQuestion: 0,
      answers: [],
      score: 0,
      completed: false
    };

    setTestSession(session);
    setLoading(false);
  };

  const handleAnswerSubmit = (questionId: string, selectedAnswer: number, correct: boolean) => {
    if (!testSession) return;

    const newAnswer = {
      questionId,
      selectedAnswer,
      correct
    };

    const updatedAnswers = [...testSession.answers, newAnswer];
    const newScore = correct ? testSession.score + 1 : testSession.score;
    const isLastQuestion = testSession.currentQuestion === testSession.questions.length - 1;

    if (isLastQuestion) {
      setTestSession({
        ...testSession,
        answers: updatedAnswers,
        score: newScore,
        completed: true
      });
    } else {
      setTestSession({
        ...testSession,
        answers: updatedAnswers,
        score: newScore,
        currentQuestion: testSession.currentQuestion + 1
      });
    }
  };

  const handleRetakeTest = () => {
    console.log('Retaking test for:', courseId);
    initializeTest(courseId);
  };

  const handleShareResults = (shareData: any) => {
    console.log('Sharing results:', shareData);
    // todo: implement sharing functionality
    alert('Sharing functionality will be implemented in the full version!');
  };

  const handleViewTestPrep = () => {
    console.log('Viewing test prep for:', courseName);
    // todo: implement test prep navigation
    alert('Test prep packages will be available in the full version!');
  };

  const handleBackToHome = () => {
    setLocation('/');
  };

  if (loading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading test...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  if (!testSession || testSession.questions.length === 0) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle>Test Not Available</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Sorry, the test for {courseName} is not available yet.
                </p>
                <Button onClick={handleBackToHome}>
                  Back to Home
                </Button>
              </CardContent>
            </Card>
          </main>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-8">
          <div className="container">
            {!testSession.completed ? (
              <TestQuestion
                question={testSession.questions[testSession.currentQuestion]}
                questionNumber={testSession.currentQuestion + 1}
                totalQuestions={testSession.questions.length}
                onAnswerSubmit={handleAnswerSubmit}
              />
            ) : (
              <TestResults
                courseId={testSession.courseId}
                courseName={courseName}
                score={testSession.score}
                totalQuestions={testSession.questions.length}
                answers={testSession.answers.map((answer, index) => {
                  const question = testSession.questions.find(q => q.id === answer.questionId);
                  return {
                    questionId: answer.questionId,
                    question: question?.question || '',
                    topic: question?.topic || '',
                    selectedAnswer: answer.selectedAnswer,
                    correctAnswer: question?.correctAnswer || 0,
                    correct: answer.correct,
                    explanation: question?.explanation || '',
                    options: question?.options || []
                  };
                })}
                onRetakeTest={handleRetakeTest}
                onShareResults={handleShareResults}
                onViewTestPrep={handleViewTestPrep}
              />
            )}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}