import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { SubjectGrid } from "./components/SubjectGrid";
import { DocumentLibrary } from "./components/DocumentLibrary";
import { Footer } from "./components/Footer";
import { AppSidebar } from "./components/AppSidebar";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import { useMemo, useState } from "react";
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
                }}
              />
              <DocumentLibrary />
            </>
          )}
          {selectedDepartment && !selectedCourse && (
            <DepartmentPage
              department={selectedDepartment}
              onBack={resetToHome}
              onSelectCourse={(courseId) => setSelectedCourseId(courseId)}
            />
          )}
          {selectedDepartment && selectedCourse && (
            <CoursePage
              course={selectedCourse}
              departmentName={selectedDepartment.name}
              onBack={() => setSelectedCourseId(null)}
            />
          )}
        </main>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
