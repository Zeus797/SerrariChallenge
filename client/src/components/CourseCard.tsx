import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Target } from 'lucide-react';

interface CourseCardProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  stats: {
    questions: number;
    avgTime: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    participants: number;
  };
  onStartTest: (courseId: string) => void;
}

export default function CourseCard({ id, name, description, icon, stats, onStartTest }: CourseCardProps) {
  const handleStartTest = () => {
    console.log(`Starting test for course: ${name}`);
    onStartTest(id);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-chart-2';
      case 'Intermediate': return 'bg-chart-3';
      case 'Advanced': return 'bg-chart-4';
      default: return 'bg-secondary';
    }
  };

  return (
    <Card className="hover-elevate transition-all duration-200 h-full flex flex-col" data-testid={`card-course-${id}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
              <img 
                src={icon} 
                alt={`${name} course icon`}
                className="w-full h-full object-cover"
                data-testid={`img-course-icon-${id}`}
              />
            </div>
            <div>
              <CardTitle className="text-xl mb-1" data-testid={`text-course-name-${id}`}>{name}</CardTitle>
              <Badge 
                className={`text-xs ${getDifficultyColor(stats.difficulty)} text-white`}
                data-testid={`badge-difficulty-${id}`}
              >
                {stats.difficulty}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <CardDescription className="text-base mb-6 flex-1" data-testid={`text-course-description-${id}`}>
          {description}
        </CardDescription>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 text-sm">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground" data-testid={`text-questions-${id}`}>
              {stats.questions} Questions
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground" data-testid={`text-time-${id}`}>
              {stats.avgTime}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground" data-testid={`text-participants-${id}`}>
              {stats.participants.toLocaleString()}
            </span>
          </div>
        </div>
        
        <Button 
          className="w-full"
          onClick={handleStartTest}
          data-testid={`button-start-test-${id}`}
        >
          Start Free Test
        </Button>
      </CardContent>
    </Card>
  );
}