import { Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import serrariLogo from '@assets/Serrari Logo Text Free_1759182390111.png';

export default function Footer() {
  const [, setLocation] = useLocation();

  const handleCourseClick = (courseId: string) => {
    setLocation(`/test/${courseId}`);
  };

  const handleResourceClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="bg-card border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src={serrariLogo} 
                alt="SerrariEd Logo" 
                className="h-8 w-auto"
                data-testid="img-serrari-logo-footer"
              />
              <span className="text-lg font-bold text-foreground">SerrariEd</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering professionals with comprehensive test preparation 
              and practice materials for career advancement.
            </p>
          </div>
          
          {/* Courses */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Test Prep Courses</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Button onClick={() => handleResourceClick('https://learn.serrarigroup.com/acca-prep-courses/')} variant="ghost" className="p-0 h-auto text-muted-foreground justify-start" data-testid="link-acca-footer">ACCA Preparation</Button></li>
              <li><Button onClick={() => handleResourceClick('https://learn.serrarigroup.com/hesi-a2-courses/')} variant="ghost" className="p-0 h-auto text-muted-foreground justify-start" data-testid="link-hesi-footer">HESI A2 Prep</Button></li>
              <li><Button onClick={() => handleResourceClick('https://learn.serrarigroup.com/ati-teas-7-courses/')} variant="ghost" className="p-0 h-auto text-muted-foreground justify-start" data-testid="link-teas-footer">ATI TEAS 7</Button></li>
              <li><Button onClick={() => handleResourceClick('https://learn.serrarigroup.com/nclex-rn-courses/')} variant="ghost" className="p-0 h-auto text-muted-foreground justify-start" data-testid="link-nclex-rn-footer">NCLEX RN</Button></li>
              <li><Button onClick={() => handleResourceClick('https://learn.serrarigroup.com/nclex-pn-courses/')} variant="ghost" className="p-0 h-auto text-muted-foreground justify-start" data-testid="link-nclex-pn-footer">NCLEX PN</Button></li>
              <li><Button onClick={() => handleResourceClick('https://learn.serrarigroup.com/hesi-exit-prep/')} variant="ghost" className="p-0 h-auto text-muted-foreground justify-start" data-testid="link-hesi-exit-footer">HESI EXIT</Button></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Button onClick={() => handleResourceClick('https://learn.serrarigroup.com/study-guides/')} variant="ghost" className="p-0 h-auto text-muted-foreground justify-start" data-testid="link-study-guides">Study Guides</Button></li>
              <li><Button onClick={() => handleResourceClick('https://learn.serrarigroup.com/practice-tests/')} variant="ghost" className="p-0 h-auto text-muted-foreground justify-start" data-testid="link-practice-tests">Practice Tests</Button></li>
              <li><Button onClick={() => handleResourceClick('https://www.youtube.com/@SerrariGroup')} variant="ghost" className="p-0 h-auto text-muted-foreground justify-start" data-testid="link-video-courses">Video Courses</Button></li>
              <li><Button onClick={() => handleResourceClick('https://learn.serrarigroup.com/flashcards/')} variant="ghost" className="p-0 h-auto text-muted-foreground justify-start" data-testid="link-flashcards">Flashcards</Button></li>
              <li><Button onClick={() => handleResourceClick('https://learn.serrarigroup.com/mobile-app/')} variant="ghost" className="p-0 h-auto text-muted-foreground justify-start" data-testid="link-mobile-app">Mobile App</Button></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span data-testid="text-contact-email">learn@serrarigroup.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span data-testid="text-contact-phone">+1 812 515-1632  +254114498239</span>
              </div>
              
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground" data-testid="text-copyright">
            © 2024 SerrariEd. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Button variant="ghost" className="text-sm text-muted-foreground p-0 h-auto" data-testid="link-privacy">
              Privacy Policy
            </Button>
            <Button variant="ghost" className="text-sm text-muted-foreground p-0 h-auto" data-testid="link-terms">
              Terms of Service
            </Button>
            <Button variant="ghost" className="text-sm text-muted-foreground p-0 h-auto" data-testid="link-support">
              Support
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}