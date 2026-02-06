import { Card } from "./ui/card";
import { Department } from "../data/catalog";

type SubjectGridProps = {
  departments: Department[];
  onSelectDepartment: (department: Department) => void;
};

export function SubjectGrid({ departments, onSelectDepartment }: SubjectGridProps) {
  return (
    <section id="departments" className="py-16 bg-gray-50 scroll-mt-24">
      <div className="container mx-auto px-4">
        <div id="courses" className="scroll-mt-24" />
        <div className="text-center mb-12">
          <h2 className="text-4xl mb-4 text-gray-900">Browse by Subject</h2>
          <p className="text-xl text-gray-600">
            Explore our extensive collection organized by academic disciplines
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((subject) => {
            const Icon = subject.icon;
            return (
              <Card
                key={subject.id}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => onSelectDepartment(subject)}
              >
                <div className="flex items-start gap-4">
                  <div className={`${subject.color} size-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className="size-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {subject.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {subject.documents} documents
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
