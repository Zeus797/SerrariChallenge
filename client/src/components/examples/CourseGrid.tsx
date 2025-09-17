import CourseGrid from '../CourseGrid';

export default function CourseGridExample() {
  const handleStartTest = (courseId: string) => {
    console.log('Starting test for:', courseId);
  };

  return <CourseGrid onStartTest={handleStartTest} />;
}