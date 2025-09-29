import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';
import heroImage from '@assets/generated_images/Students_studying_hero_image_0d52e563.png';

export default function Hero() {
  const handleGetStarted = () => {
    console.log('Get started clicked');
    document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Students studying for professional certifications" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
      </div>
      {/* Content */}
      <div className="relative z-10 container max-w-4xl text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Master Your 
          <span className="block text-[#de23c6]">Professional Exams</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
          Take free 10-question challenge tests for ACCA, HESI A2, ATI TEAS 7, NCLEX RN & PN. 
          Get instant explanations and personalized study recommendations.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            size="lg" 
            className="text-lg px-8 py-4 bg-primary hover:bg-primary/90"
            onClick={handleGetStarted}
            data-testid="button-get-started"
          >
            Start Free Test <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="text-lg px-8 py-4 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            onClick={() => window.open('https://learn.serrarigroup.com/', '_blank', 'noopener,noreferrer')}
            data-testid="button-learn-more"
          >
            Learn More
          </Button>
        </div>
        
        {/* Features List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="h-5 w-5 text-chart-2" />
            <span className="text-gray-200">Instant Results</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="h-5 w-5 text-chart-2" />
            <span className="text-gray-200">Detailed Explanations</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="h-5 w-5 text-chart-2" />
            <span className="text-gray-200">Share & Compare</span>
          </div>
        </div>
      </div>
    </section>
  );
}