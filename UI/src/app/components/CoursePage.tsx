import { useMemo, useState } from "react";
import { Course } from "../data/catalog";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ChevronLeft, Download, Search } from "lucide-react";

type CoursePageProps = {
  course: Course;
  departmentName: string;
  onBack: () => void;
};

export function CoursePage({ course, departmentName, onBack }: CoursePageProps) {
  const [query, setQuery] = useState("");

  const filteredPapers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return course.pastPapers;
    return course.pastPapers.filter((paper) => {
      return (
        paper.code.toLowerCase().includes(normalized) ||
        paper.name.toLowerCase().includes(normalized) ||
        paper.year.toLowerCase().includes(normalized)
      );
    });
  }, [course.pastPapers, query]);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <Button variant="ghost" className="gap-2" onClick={onBack}>
                <ChevronLeft className="size-4" />
                Back to {departmentName}
              </Button>
            </div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              {course.code}
            </p>
            <h2 className="text-4xl text-gray-900">{course.name}</h2>
            <p className="text-lg text-gray-600 mt-2">{course.description}</p>
          </div>
          <div className="size-16 rounded-2xl bg-slate-900/5 flex items-center justify-center shadow-sm">
            <course.icon className="size-8 text-slate-700" />
          </div>
        </div>

        <Tabs defaultValue="past-papers" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="past-papers">Past papers</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          <TabsContent value="past-papers" className="mt-6 space-y-6">
            <Card className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-4 md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input
                    placeholder="Search by code, name, or year..."
                    className="pl-9"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>
                <Button variant="outline">Search</Button>
              </div>
            </Card>

            <div className="space-y-4">
              {filteredPapers.map((paper) => (
                <Card key={paper.id} className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        {paper.code} · {paper.year}
                      </p>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {paper.name}
                      </h3>
                      <p className="text-sm text-slate-600 mt-2">
                        {paper.description}
                      </p>
                    </div>
                    <Button className="md:self-start gap-2">
                      <Download className="size-4" />
                      Download
                    </Button>
                  </div>
                </Card>
              ))}
              {filteredPapers.length === 0 && (
                <Card className="p-8 text-center text-slate-500">
                  No past papers match your search.
                </Card>
              )}
            </div>
          </TabsContent>
          <TabsContent value="documents" className="mt-6 space-y-4">
            {course.documents.map((doc) => (
              <Card key={doc.id} className="p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {doc.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-2">
                      {doc.description}
                    </p>
                  </div>
                  <Button variant="outline" className="md:self-start gap-2">
                    <Download className="size-4" />
                    Download
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
