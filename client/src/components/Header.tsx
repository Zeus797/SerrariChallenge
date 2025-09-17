import { Button } from '@/components/ui/button';
import { Moon, Sun, GraduationCap } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-foreground" data-testid="text-brand-name">SerrariEd</span>
            <span className="text-xs text-muted-foreground">Professional Test Prep</span>
          </div>
        </div>
        
        <nav className="flex items-center space-x-6">
          <Button
            variant="ghost"
            className="text-sm font-medium"
            data-testid="link-courses"
          >
            Courses
          </Button>
          <Button
            variant="ghost"
            className="text-sm font-medium"
            data-testid="link-about"
          >
            About
          </Button>
          <Button
            variant="ghost"
            className="text-sm font-medium"
            data-testid="link-contact"
          >
            Contact
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>
        </nav>
      </div>
    </header>
  );
}