import TestQuestion from '../TestQuestion';

export default function TestQuestionExample() {
  const sampleQuestion = {
    id: 'q1',
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
  };

  const handleAnswerSubmit = (questionId: string, selectedAnswer: number, correct: boolean) => {
    console.log('Answer submitted:', { questionId, selectedAnswer, correct });
  };

  return (
    <div className="p-4">
      <TestQuestion
        question={sampleQuestion}
        questionNumber={1}
        totalQuestions={10}
        onAnswerSubmit={handleAnswerSubmit}
        timeLimit={90}
      />
    </div>
  );
}