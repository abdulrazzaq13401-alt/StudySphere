import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { SubjectGrid } from "./components/SubjectGrid";
import { DocumentLibrary } from "./components/DocumentLibrary";
import { Footer } from "./components/Footer";
import { AppSidebar } from "./components/AppSidebar";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import { useEffect, useMemo, useState } from "react";
import { Course, departments } from "./data/catalog";
import { DepartmentPage } from "./components/DepartmentPage";
import { CoursePage } from "./components/CoursePage";
import { AdminPortal } from "./components/AdminPortal";
import { CourseDto, fetchCourses, fetchDepartments } from "./lib/api";

function toCourseRouteId(code: string) {
  return code.trim().toLowerCase().replace(/\s+/g, "-");
}

function toCatalogCourse(course: CourseDto, icon: Course["icon"]): Course {
  const details = [
    course.instructorName ? `Instructor: ${course.instructorName}` : null,
    course.semesterName ? `Semester: ${course.semesterName}` : null,
    `${course.resourceCount} resources`,
  ].filter(Boolean);

  return {
    id: toCourseRouteId(course.code),
    code: course.code,
    name: course.title,
    description: details.join(" - "),
    icon,
    pastPapers: [],
    documents: [],
  };
}

export default function App() {
  const pathname = window.location.pathname.toLowerCase();
  const isAdminPortal =
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/user/admin" ||
    pathname.startsWith("/user/admin/") ||
    pathname === "/admin/departments" ||
    pathname.startsWith("/admin/departments/");

  if (isAdminPortal) {
    return <AdminPortal />;
  }

  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [liveCourses, setLiveCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [courseLoadError, setCourseLoadError] = useState<string | null>(null);

  const selectedDepartment = useMemo(
    () => departments.find((dept) => dept.id === selectedDepartmentId) ?? null,
    [selectedDepartmentId],
  );
  const selectedDepartmentWithCourses = useMemo(() => {
    if (!selectedDepartment) return null;

    return {
      ...selectedDepartment,
      courses: liveCourses,
    };
  }, [liveCourses, selectedDepartment]);
  const selectedCourse = useMemo(() => {
    if (!selectedDepartmentWithCourses || !selectedCourseId) return null;
    return selectedDepartmentWithCourses.courses.find((course) => course.id === selectedCourseId) ?? null;
  }, [selectedDepartmentWithCourses, selectedCourseId]);

  const resetToHome = () => {
    setSelectedCourseId(null);
    setSelectedDepartmentId(null);
  };

  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const dept = params.get("dept");
      const course = params.get("course");
      setSelectedDepartmentId(dept);
      setSelectedCourseId(course);
    };

    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);

  useEffect(() => {
    let shouldIgnore = false;

    if (!selectedDepartment) {
      setLiveCourses([]);
      setCourseLoadError(null);
      setIsLoadingCourses(false);
      return;
    }

    const loadDepartmentCourses = async () => {
      setIsLoadingCourses(true);
      setCourseLoadError(null);
      setLiveCourses([]);

      try {
        const apiDepartments = await fetchDepartments();
        const apiDepartment = apiDepartments.find(
          (department) => department.slug.toLowerCase() === selectedDepartment.id,
        );

        if (!apiDepartment) {
          throw new Error("This department was not found in the database.");
        }

        const apiCourses = await fetchCourses(apiDepartment.id);

        if (shouldIgnore) return;

        setLiveCourses(
          apiCourses.map((course) => toCatalogCourse(course, selectedDepartment.icon)),
        );
      } catch (error) {
        if (shouldIgnore) return;

        setCourseLoadError(
          error instanceof Error ? error.message : "Unable to load courses for this department.",
        );
      } finally {
        if (!shouldIgnore) {
          setIsLoadingCourses(false);
        }
      }
    };

    void loadDepartmentCourses();

    return () => {
      shouldIgnore = true;
    };
  }, [selectedDepartment]);

  const pushState = (deptId: string | null, courseId: string | null) => {
    const params = new URLSearchParams();
    if (deptId) params.set("dept", deptId);
    if (courseId) params.set("course", courseId);
    const query = params.toString();
    const nextUrl = query ? `?${query}` : window.location.pathname;
    window.history.pushState({}, "", nextUrl);
  };

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <SidebarInset className="min-h-screen bg-white">
        <Header onHomeClick={resetToHome} />
        <main>
          {!selectedDepartment && (
            <>
              <Hero />
              <SubjectGrid
                departments={departments}
                onSelectDepartment={(dept) => {
                  setSelectedDepartmentId(dept.id);
                  setSelectedCourseId(null);
                  pushState(dept.id, null);
                }}
              />
              <DocumentLibrary />
            </>
          )}
          {selectedDepartmentWithCourses && !selectedCourse && (
            <DepartmentPage
              department={selectedDepartmentWithCourses}
              isLoadingCourses={isLoadingCourses}
              courseLoadError={courseLoadError}
              onBack={() => {
                resetToHome();
                pushState(null, null);
              }}
              onSelectCourse={(courseId) => {
                setSelectedCourseId(courseId);
                pushState(selectedDepartment.id, courseId);
              }}
            />
          )}
          {selectedDepartmentWithCourses && selectedCourse && (
            <CoursePage
              course={selectedCourse}
              departmentId={selectedDepartmentWithCourses.id}
              departmentName={selectedDepartmentWithCourses.name}
              onBack={() => {
                setSelectedCourseId(null);
                pushState(selectedDepartmentWithCourses.id, null);
              }}
            />
          )}
        </main>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
