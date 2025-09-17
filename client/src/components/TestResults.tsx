import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Target, 
  BookOpen, 
  Share2, 
  RefreshCw, 
  TrendingUp,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface TestResultsProps {
  courseId: string;
  courseName: string;
  score: number;
  totalQuestions: number;
  answers: Array<{
    questionId: string;
    question: string;
    topic: string;
    selectedAnswer: number;
    correctAnswer: number;
    correct: boolean;
    explanation: string;
    options: string[];
  }>;
  onRetakeTest: () => void;
  onShareResults: (shareData: any) => void;
  onViewTestPrep: () => void;
}

export default function TestResults({
  courseId,
  courseName,
  score,
  totalQuestions,
  answers,
  onRetakeTest,
  onShareResults,
  onViewTestPrep
}: TestResultsProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 80) return { level: 'Excellent', color: 'text-chart-2', bgColor: 'bg-chart-2/10' };
    if (percentage >= 65) return { level: 'Good', color: 'text-chart-3', bgColor: 'bg-chart-3/10' };
    if (percentage >= 50) return { level: 'Fair', color: 'text-chart-3', bgColor: 'bg-chart-3/10' };
    return { level: 'Needs Improvement', color: 'text-chart-4', bgColor: 'bg-chart-4/10' };
  };

  const performance = getPerformanceLevel(percentage);

  // Analyze topics for recommendations
  const topicAnalysis = answers.reduce((acc, answer) => {
    const topic = answer.topic;
    if (!acc[topic]) {
      acc[topic] = { correct: 0, total: 0 };
    }
    acc[topic].total += 1;
    if (answer.correct) {
      acc[topic].correct += 1;
    }
    return acc;
  }, {} as Record<string, { correct: number; total: number }>);

  const weakTopics = Object.entries(topicAnalysis)
    .filter(([_, stats]) => stats.correct / stats.total < 0.7)
    .map(([topic]) => topic);

  const handleShare = () => {
    const shareData = {
      courseId,
      courseName,
      score,
      totalQuestions,
      percentage
    };
    console.log('Sharing results:', shareData);
    onShareResults(shareData);
  };

  const handleRetake = () => {
    console.log('Retaking test for:', courseName);
    onRetakeTest();
  };

  const handleViewPrep = () => {
    console.log('Viewing test prep for:', courseName);
    onViewTestPrep();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Overall Score Card */}
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <Trophy className="h-12 w-12 text-primary" />
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl mb-2" data-testid="text-results-title">
            {courseName} Challenge Test Results
          </CardTitle>
          <Badge 
            className={`text-lg px-4 py-2 ${performance.bgColor} ${performance.color} border-0`}
            data-testid="badge-performance-level"
          >
            {performance.level}
          </Badge>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6">
            <div className="text-6xl font-bold text-primary mb-2" data-testid="text-score-percentage">
              {percentage}%
            </div>
            <div className="text-muted-foreground" data-testid="text-score-fraction">
              {score} out of {totalQuestions} correct
            </div>
            <Progress value={percentage} className="mt-4 h-3" data-testid="progress-score" />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleRetake} variant="outline" data-testid="button-retake-test">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retake Test
            </Button>
            <Button onClick={handleShare} variant="outline" data-testid="button-share-results">
              <Share2 className="mr-2 h-4 w-4" />
              Share Results
            </Button>
            <Button onClick={handleViewPrep} data-testid="button-view-test-prep">
              <BookOpen className="mr-2 h-4 w-4" />
              View Test Prep
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Performance Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Topic Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5" />
              Topic Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(topicAnalysis).map(([topic, stats]) => {
                const topicPercentage = Math.round((stats.correct / stats.total) * 100);
                return (
                  <div key={topic}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium" data-testid={`text-topic-${topic}`}>
                        {topic}
                      </span>
                      <span className="text-sm text-muted-foreground" data-testid={`text-topic-score-${topic}`}>
                        {stats.correct}/{stats.total} ({topicPercentage}%)
                      </span>
                    </div>
                    <Progress value={topicPercentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Study Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Study Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {weakTopics.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Focus on these topics to improve your performance:
                </p>
                <div className="space-y-2">
                  {weakTopics.map((topic) => (
                    <Badge key={topic} variant="secondary" className="mr-2" data-testid={`badge-weak-topic-${topic}`}>
                      {topic}
                    </Badge>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm">
                    <strong>Recommendation:</strong> Consider reviewing these topics with our comprehensive test prep materials 
                    to improve your understanding and boost your score.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <CheckCircle className="h-12 w-12 text-chart-2 mx-auto mb-2" />
                <p className="text-sm">
                  Excellent work! You performed well across all topics.
                  Continue practicing to maintain your strong knowledge base.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Question Review */}
      <Card>
        <CardHeader>
          <CardTitle>Question Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {answers.map((answer, index) => (
              <div key={answer.questionId} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Question {index + 1}</span>
                    <Badge variant="secondary" className="text-xs">
                      {answer.topic}
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    {answer.correct ? (
                      <CheckCircle className="h-5 w-5 text-chart-2" data-testid={`icon-correct-${index}`} />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive" data-testid={`icon-incorrect-${index}`} />
                    )}
                  </div>
                </div>
                <p className="text-sm mb-2" data-testid={`text-question-review-${index}`}>
                  {answer.question}
                </p>
                <div className="text-xs space-y-1">
                  <p>
                    <strong>Your answer:</strong> 
                    <span className={answer.correct ? 'text-chart-2' : 'text-destructive'}>
                      {answer.selectedAnswer >= 0 ? answer.options[answer.selectedAnswer] : 'No answer selected'}
                    </span>
                  </p>
                  {!answer.correct && (
                    <p>
                      <strong>Correct answer:</strong> 
                      <span className="text-chart-2">
                        {answer.options[answer.correctAnswer]}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}