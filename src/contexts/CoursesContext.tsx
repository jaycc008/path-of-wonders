import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getCourses, Course } from '../api/course';

interface CoursesContextValue {
  courses: Course[];
  isLoading: boolean;
  error: Error | null;
}

const CoursesContext = createContext<CoursesContextValue | undefined>(undefined);

export function CoursesProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setIsLoading(true);
        const response = await getCourses();
        if (!cancelled) {
          setCourses(response.data?.items ?? []);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setCourses([]);
          setError(e instanceof Error ? e : new Error('Failed to load courses'));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <CoursesContext.Provider value={{ courses, isLoading, error }}>{children}</CoursesContext.Provider>
  );
}

export function useCourses() {
  const ctx = useContext(CoursesContext);
  if (ctx === undefined) {
    throw new Error('useCourses must be used within a CoursesProvider');
  }
  return ctx;
}
