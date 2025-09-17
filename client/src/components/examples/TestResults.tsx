import TestResults from '../TestResults';

export default function TestResultsExample() {
  const sampleAnswers = [
    {
      questionId: 'q1',
      question: 'Which of the following is the primary purpose of financial statements?',
      topic: 'Financial Reporting',
      selectedAnswer: 1,
      correctAnswer: 1,
      correct: true,
      explanation: 'Correct explanation about financial statements.',
      options: ['Option A', 'Option B - Correct', 'Option C', 'Option D']
    },
    {
      questionId: 'q2',
      question: 'What is the accounting equation?',
      topic: 'Accounting Fundamentals',
      selectedAnswer: 0,
      correctAnswer: 2,
      correct: false,
      explanation: 'The accounting equation is Assets = Liabilities + Equity.',
      options: ['Assets + Liabilities = Equity', 'Assets - Equity = Liabilities', 'Assets = Liabilities + Equity', 'Assets + Equity = Liabilities']
    }
  ];

  const handleRetake = () => console.log('Retaking test');
  const handleShare = (data: any) => console.log('Sharing:', data);
  const handleViewPrep = () => console.log('Viewing test prep');

  return (
    <div className="p-4">
      <TestResults
        courseId="acca"
        courseName="ACCA"
        score={7}
        totalQuestions={10}
        answers={sampleAnswers}
        onRetakeTest={handleRetake}
        onShareResults={handleShare}
        onViewTestPrep={handleViewPrep}
      />
    </div>
  );
}