import CourseCard from '../CourseCard';
import accaIcon from '@assets/generated_images/ACCA_course_icon_ca481533.png';

export default function CourseCardExample() {
  const handleStartTest = (courseId: string) => {
    console.log('Starting test for:', courseId);
  };

  return (
    <div className="max-w-sm p-4">
      <CourseCard
        id="acca"
        name="ACCA"
        description="Association of Chartered Certified Accountants certification preparation with comprehensive accounting principles and financial management questions."
        icon={accaIcon}
        stats={{
          questions: 10,
          avgTime: '15 min',
          difficulty: 'Advanced',
          participants: 12847
        }}
        onStartTest={handleStartTest}
      />
    </div>
  );
}