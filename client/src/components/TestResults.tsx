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
  onReturnHome: () => void;
}

export default function TestResults({
  courseId,
  courseName,
  score,
  totalQuestions,
  answers,
  onRetakeTest,
  onShareResults,
  onReturnHome
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

  // Course-specific study plan URLs
  const getStudyPlanUrl = (courseId: string) => {
    const urls: Record<string, string> = {
      'acca': 'https://learn.serrarigroup.com/acca-exam-prep-special-offer/',
      'hesi-a2': 'https://learn.serrarigroup.com/hesi-a2-special-offer/',
      'ati-teas': 'https://learn.serrarigroup.com/ati-teas-7-special-offer/',
      'hesi-exit': 'https://learn.serrarigroup.com/hesi-exit-special-offer/',
      'nclex-rn': 'https://learn.serrarigroup.com/nclex-special-offer/',
      'nclex-pn': 'https://learn.serrarigroup.com/nclex-pn-special-offer/'
    };
    return urls[courseId] || 'https://learn.serrarigroup.com/';
  };

  const handleExploreStudyPlans = () => {
    const url = getStudyPlanUrl(courseId);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 px-4">
      {/* Overall Score Card */}
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <Trophy className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
              </div>
            </div>
          </div>
          <CardTitle className="text-xl sm:text-2xl mb-2 px-2" data-testid="text-results-title">
            {courseName} Challenge Test Results
          </CardTitle>
          <Badge 
            className={`text-sm sm:text-lg px-3 sm:px-4 py-1 sm:py-2 ${performance.bgColor} ${performance.color} border-0`}
            data-testid="badge-performance-level"
          >
            {performance.level}
          </Badge>
        </CardHeader>
        
        <CardContent>
          <div className="mb-4 sm:mb-6">
            <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-2" data-testid="text-score-percentage">
              {percentage}%
            </div>
            <div className="text-sm sm:text-base text-muted-foreground" data-testid="text-score-fraction">
              {score} out of {totalQuestions} correct
            </div>
            <Progress value={percentage} className="mt-3 sm:mt-4 h-2 sm:h-3" data-testid="progress-score" />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button onClick={handleRetake} variant="outline" className="text-sm sm:text-base" data-testid="button-retake-test">
              <RefreshCw className="mr-2 h-3 sm:h-4 w-3 sm:w-4" />
              Retake Test
            </Button>
            <Button onClick={handleShare} variant="outline" className="text-sm sm:text-base" data-testid="button-share-results">
              <Share2 className="mr-2 h-3 sm:h-4 w-3 sm:w-4" />
              Share Results
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
                  <p className="text-sm mb-3">
                    Based on your performance, we recommend our <strong>{courseName} Complete Study Package</strong>.
                    Our comprehensive study materials are designed to help you master the concepts and excel in your {courseName}. 
                    Get detailed explanations, practice questions, and study strategies from expert educators.
                  </p>
                  <Button 
                    onClick={handleExploreStudyPlans} 
                    className="w-full"
                    data-testid="button-explore-study-plans"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Explore Study Materials
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 space-y-4">
                <CheckCircle className="h-12 w-12 text-chart-2 mx-auto mb-2" />
                <p className="text-sm mb-3">
                  Excellent work! You performed well across all topics.
                  Continue practicing to maintain your strong knowledge base.
                </p>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm mb-3">
                    Based on your performance, we recommend our <strong>{courseName} Complete Study Package</strong>.
                    Our comprehensive study materials are designed to help you master the concepts and excel in your {courseName}. 
                    Get detailed explanations, practice questions, and study strategies from expert educators.
                  </p>
                  <Button 
                    onClick={handleExploreStudyPlans} 
                    className="w-full"
                    data-testid="button-explore-study-plans"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Explore Study Materials
                  </Button>
                </div>
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
              <div key={answer.questionId} className="border rounded-lg p-3 sm:p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mb-2">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="text-xs sm:text-sm font-medium">Question {index + 1}</span>
                    <Badge variant="secondary" className="text-xs">
                      {answer.topic}
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    {answer.correct ? (
                      <CheckCircle className="h-4 sm:h-5 w-4 sm:w-5 text-chart-2" data-testid={`icon-correct-${index}`} />
                    ) : (
                      <XCircle className="h-4 sm:h-5 w-4 sm:w-5 text-destructive" data-testid={`icon-incorrect-${index}`} />
                    )}
                  </div>
                </div>
                <p className="text-xs sm:text-sm mb-2" data-testid={`text-question-review-${index}`}>
                  {answer.question}
                </p>
                <div className="text-xs space-y-1">
                  <p className="break-words">
                    <strong>Your answer:</strong> 
                    <span className={answer.correct ? 'text-chart-2' : 'text-destructive'}>
                      {answer.selectedAnswer >= 0 ? answer.options[answer.selectedAnswer] : 'No answer selected'}
                    </span>
                  </p>
                  {!answer.correct && (
                    <p className="break-words">
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

      {/* Return to Homepage */}
      <div className="text-center pt-6">
        <Button
          onClick={onReturnHome}
          variant="outline"
          size="lg"
          data-testid="button-return-home"
        >
          Return to Homepage
        </Button>
      </div>
    </div>
  );
}