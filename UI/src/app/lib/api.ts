export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://localhost:5001";

export async function parseApiError(response: Response) {
  const payload = (await response.json().catch(() => null)) as { message?: string } | null;
  return payload?.message ?? "Request failed.";
}

export type DepartmentDto = {
  id: number;
  name: string;
  slug: string;
  courseCount: number;
  resourceCount: number;
};

export type CourseDto = {
  id: number;
  code: string;
  title: string;
  departmentId: number;
  departmentName: string;
  instructorId: number;
  instructorName: string;
  semesterId: number | null;
  semesterName: string;
  resourceCount: number;
};

export async function fetchDepartments() {
  const response = await fetch(`${API_BASE_URL}/api/departments`);

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return (await response.json()) as DepartmentDto[];
}

export async function fetchCourses(departmentId?: number) {
  const url = new URL(`${API_BASE_URL}/api/courses`);

  if (departmentId) {
    url.searchParams.set("departmentId", String(departmentId));
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return (await response.json()) as CourseDto[];
}
