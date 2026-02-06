import { Department } from "../data/catalog";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronLeft } from "lucide-react";

type DepartmentPageProps = {
  department: Department;
  onBack: () => void;
  onSelectCourse: (courseId: string) => void;
};

export function DepartmentPage({
  department,
  onBack,
  onSelectCourse,
}: DepartmentPageProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <Button variant="ghost" className="gap-2" onClick={onBack}>
                <ChevronLeft className="size-4" />
                Back to Departments
              </Button>
            </div>
            <h2 className="text-4xl text-gray-900">{department.name}</h2>
            <p className="text-lg text-gray-600 mt-2">
              Choose a course to explore past papers and documents.
            </p>
          </div>
          <div className={`${department.color} size-16 rounded-2xl flex items-center justify-center shadow-lg`}>
            <department.icon className="size-8 text-white" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {department.courses.map((course) => (
            <Card
              key={course.id}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onSelectCourse(course.id)}
            >
              <div className="flex items-start gap-4">
                <div className="size-12 rounded-xl bg-slate-900/5 flex items-center justify-center">
                  <course.icon className="size-6 text-slate-700" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    {course.code}
                  </p>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {course.name}
                  </h3>
                  <p className="text-sm text-slate-600 mt-2">
                    {course.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
