import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Moon, Sun, ChevronDown } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useLocation } from 'wouter';
import serrariLogo from '@assets/serrari logo 2 _1758729670733.png';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();

  const courses = [
    { id: 'acca', name: 'ACCA', title: 'ACCA Professional Certification' },
    { id: 'hesi-a2', name: 'HESI A2', title: 'HESI A2 Admission Assessment' },
    { id: 'ati-teas', name: 'ATI TEAS 7', title: 'ATI TEAS 7 Nursing School Exam' },
    { id: 'nclex-rn', name: 'NCLEX RN', title: 'NCLEX-RN Licensure Exam' },
    { id: 'nclex-pn', name: 'NCLEX PN', title: 'NCLEX-PN Licensure Exam' },
    { id: 'hesi-exit', name: 'HESI EXIT', title: 'HESI EXIT Exam' }
  ];

  const handleCourseSelect = (courseId: string) => {
    setLocation(`/test/${courseId}`);
  };

  const handleAboutClick = () => {
    window.open('https://learn.serrarigroup.com/about-us/', '_blank', 'noopener,noreferrer');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src={serrariLogo} 
            alt="SerrariEd Logo" 
            className="h-12 w-auto"
            data-testid="img-serrari-logo"
          />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-foreground" data-testid="text-brand-name">SerrariEd</span>
            <span className="text-xs text-muted-foreground">Professional Test Prep</span>
          </div>
        </div>
        
        <nav className="flex items-center space-x-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-sm font-medium"
                data-testid="dropdown-courses"
              >
                Courses
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {courses.map((course) => (
                <DropdownMenuItem
                  key={course.id}
                  onClick={() => handleCourseSelect(course.id)}
                  className="cursor-pointer"
                  data-testid={`dropdown-course-${course.id}`}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{course.name}</span>
                    <span className="text-xs text-muted-foreground">{course.title}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            className="text-sm font-medium"
            onClick={handleAboutClick}
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