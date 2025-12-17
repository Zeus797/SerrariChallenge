import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Trophy, BarChart3, BookOpen, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmailCaptureModalProps {
  isOpen: boolean;
  onEmailSubmit: (email: string) => Promise<void>;
  courseName: string;
  score: number;
  totalQuestions: number;
}

export default function EmailCaptureModal({ 
  isOpen, 
  onEmailSubmit, 
  courseName,
  score,
  totalQuestions 
}: EmailCaptureModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email address to view your results.',
        variant: 'destructive'
      });
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await onEmailSubmit(email);
      setIsSubmitting(false);
      toast({
        title: 'Thank you!',
        description: 'Your results have been saved. Explore more courses on our platform.',
      });

      // Redirect to Serrari Group website after a short delay
      setTimeout(() => {
        window.location.href = 'https://learn.serrarigroup.com';
      }, 2000);
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: 'Failed to Save Email',
        description: 'There was an error saving your email. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const scorePercentage = Math.round((score / totalQuestions) * 100);
  const performanceLevel = scorePercentage >= 80 ? 'Excellent' : scorePercentage >= 70 ? 'Good' : scorePercentage >= 60 ? 'Fair' : 'Needs Improvement';

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md mx-auto p-0 overflow-hidden" data-testid="dialog-email-capture">
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background p-6">
          <DialogHeader className="text-center mb-6">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-bold text-foreground" data-testid="text-completion-title">
              Challenge Complete! 🎉
            </DialogTitle>
            <p className="text-muted-foreground mt-2" data-testid="text-completion-subtitle">
              You've finished the {courseName} challenge test
            </p>
          </DialogHeader>

          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span className="font-medium">Your Performance</span>
                </div>
                <span className="text-2xl font-bold text-primary">{scorePercentage}%</span>
              </div>
              <div className="text-sm text-muted-foreground mb-2">
                {score} out of {totalQuestions} questions correct
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-chart-3" />
                <span className="text-sm font-medium text-chart-3">{performanceLevel}</span>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Mail className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Stay Connected</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Enter your email to save your results and explore more courses on our platform
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                data-testid="input-email"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
              data-testid="button-submit-email"
            >
{isSubmitting ? 'Processing...' : 'Continue to Platform →'}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-4">
            We respect your privacy. Your email will only be used to save your results and send you relevant study resources.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}