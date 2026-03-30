import { api } from './index';
import type { Course } from './course';

/**
 * Published course row for marketing (no modules / overview sections).
 * Field names follow API; extras allowed for forward compatibility.
 */
export interface LandingPageCourse {
  id: number | string;
  name?: string | null;
  title?: string | null;
  description?: string | null;
  thumbnail_url?: string | null;
  image?: string | null;
  intro_video_url?: string | null;
  price?: number | null;
  category?: string | null;
  duration?: string | null;
  students_count?: number | null;
  rating?: number | null;
  level?: string | null;
  what_you_will_learn?: string[] | null;
  whatYouWillLearn?: string[] | null;
  [key: string]: unknown;
}

export interface LandingCoursesPagination {
  page: number;
  page_size: number;
  total: number;
  pages: number;
}

export interface LandingCoursesListData {
  items: LandingPageCourse[];
  pagination: LandingCoursesPagination;
}

/** Matches `build_response(data={ items, pagination })` used by the backend. */
export interface LandingCoursesListResponse {
  status: boolean;
  data: LandingCoursesListData;
  message?: string;
}

/**
 * GET /api/v1/.../courses?page=&page_size=
 * Default: `landing/courses` when router is mounted with prefix `/landing`.
 * Override with `VITE_LANDING_COURSES_PATH` if your backend uses a different prefix.
 */
export const LANDING_COURSES_PATH =
  import.meta.env.VITE_LANDING_COURSES_PATH?.replace(/^\//, '') || 'landing-page/courses';

export interface GetLandingCoursesParams {
  page?: number;
  page_size?: number;
}

export function mapLandingCourseToCourse(row: LandingPageCourse): Course {
  const learn = row.whatYouWillLearn ?? row.what_you_will_learn;
  const learnList = Array.isArray(learn) ? learn : undefined;

  return {
    id: row.id as Course['id'],
    name: row.name ?? row.title ?? undefined,
    title: row.title ?? row.name ?? undefined,
    description: row.description ?? '',
    image: row.image ?? undefined,
    thumbnail_url: row.thumbnail_url ?? row.image ?? undefined,
    intro_video_url: row.intro_video_url ?? undefined,
    price: row.price ?? 0,
    category: row.category ?? undefined,
    duration: row.duration ?? undefined,
    students_count: row.students_count ?? undefined,
    rating: row.rating ?? undefined,
    level: row.level ?? undefined,
    ...(learnList?.length ? { whatYouWillLearn: learnList } : {}),
  } as Course;
}

/**
 * List published courses for the landing / marketing pages.
 */
export async function getLandingCourses(
  params: GetLandingCoursesParams = {}
): Promise<LandingCoursesListResponse> {
  const page = params.page ?? 1;
  const page_size = params.page_size ?? 10;

  const response = await api.get<LandingCoursesListResponse>(LANDING_COURSES_PATH, {
    params: { page, page_size },
  });

  const body = response.data;
  if (body && typeof body === 'object' && 'status' in body && body.status === false) {
    throw new Error(body.message || 'Failed to load courses');
  }

  return body;
}
