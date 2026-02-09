import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { SubjectGrid } from "./components/SubjectGrid";
import { DocumentLibrary } from "./components/DocumentLibrary";
import { Footer } from "./components/Footer";
import { AppSidebar } from "./components/AppSidebar";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import { useEffect, useMemo, useState } from "react";
import { departments } from "./data/catalog";
import { DepartmentPage } from "./components/DepartmentPage";
import { CoursePage } from "./components/CoursePage";

export default function App() {
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const selectedDepartment = useMemo(
    () => departments.find((dept) => dept.id === selectedDepartmentId) ?? null,
    [selectedDepartmentId],
  );
  const selectedCourse = useMemo(() => {
    if (!selectedDepartment || !selectedCourseId) return null;
    return selectedDepartment.courses.find((course) => course.id === selectedCourseId) ?? null;
  }, [selectedDepartment, selectedCourseId]);

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
          {selectedDepartment && !selectedCourse && (
            <DepartmentPage
              department={selectedDepartment}
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
          {selectedDepartment && selectedCourse && (
            <CoursePage
              course={selectedCourse}
              departmentName={selectedDepartment.name}
              onBack={() => {
                setSelectedCourseId(null);
                pushState(selectedDepartment.id, null);
              }}
            />
          )}
        </main>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
