import CourseCard from './CourseCard';
import { Course } from '@shared/schema';

// Import course icons
import accaIcon from '@assets/generated_images/ACCA_course_icon_ca481533.png';
import hesiIcon from '@assets/generated_images/HESI_A2_course_icon_95b7f3f6.png';
import teasIcon from '@assets/generated_images/ATI_TEAS_7_icon_1b8eb743.png';
import nclexRnIcon from '@assets/generated_images/NCLEX_RN_icon_9dbce4c8.png';
import nclexPnIcon from '@assets/generated_images/NCLEX_PN_icon_23325424.png';

interface CourseGridProps {
  onStartTest: (courseId: string) => void;
}

// todo: remove mock functionality - replace with real data from backend
const mockCourses = [
  {
    id: 'acca',
    name: 'ACCA',
    description: 'Association of Chartered Certified Accountants certification preparation with comprehensive accounting principles and financial management questions.',
    icon: accaIcon,
    stats: {
      questions: 10,
      avgTime: '15 min',
      difficulty: 'Advanced' as const,
      participants: 12847
    }
  },
  {
    id: 'hesi-a2',
    name: 'HESI A2',
    description: 'Health Education Systems Inc. Admission Assessment preparation covering anatomy, math, reading, and critical thinking skills.',
    icon: hesiIcon,
    stats: {
      questions: 10,
      avgTime: '12 min',
      difficulty: 'Intermediate' as const,
      participants: 8952
    }
  },
  {
    id: 'ati-teas',
    name: 'ATI TEAS 7',
    description: 'Assessment Technologies Institute Test of Essential Academic Skills covering reading, math, science, and English language usage.',
    icon: teasIcon,
    stats: {
      questions: 10,
      avgTime: '14 min',
      difficulty: 'Intermediate' as const,
      participants: 15632
    }
  },
  {
    id: 'nclex-rn',
    name: 'NCLEX RN',
    description: 'National Council Licensure Examination for Registered Nurses with comprehensive nursing knowledge and clinical judgment questions.',
    icon: nclexRnIcon,
    stats: {
      questions: 10,
      avgTime: '16 min',
      difficulty: 'Advanced' as const,
      participants: 24785
    }
  },
  {
    id: 'nclex-pn',
    name: 'NCLEX PN',
    description: 'National Council Licensure Examination for Practical Nurses focusing on safe, effective care and nursing fundamentals.',
    icon: nclexPnIcon,
    stats: {
      questions: 10,
      avgTime: '13 min',
      difficulty: 'Intermediate' as const,
      participants: 11463
    }
  }
];

export default function CourseGrid({ onStartTest }: CourseGridProps) {
  return (
    <section id="courses" className="py-16 bg-background">
      <div className="container max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-courses-heading">
            Choose Your Challenge Test
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-courses-description">
            Select from our comprehensive range of professional certification practice tests. 
            Each test includes 10 carefully crafted questions with detailed explanations.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto" data-testid="grid-courses">
          {mockCourses.map((course) => (
            <div key={course.id} className="w-full sm:w-80 flex-shrink-0">
              <CourseCard
                id={course.id}
                name={course.name}
                description={course.description}
                icon={course.icon}
                stats={course.stats}
                onStartTest={onStartTest}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}