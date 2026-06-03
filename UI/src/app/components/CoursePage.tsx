import { useEffect, useMemo, useState } from "react";
import { Course } from "../data/catalog";
import { API_BASE_URL } from "../lib/api";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ChevronLeft, Download, Eye, Search } from "lucide-react";

type CoursePageProps = {
  course: Course;
  departmentId: string;
  departmentName: string;
  onBack: () => void;
};

type ResourceItem = {
  id: number;
  title: string;
  description: string;
  resourceTypeLabel: string;
  courseCode: string;
  courseTitle: string;
  fileName: string;
  fileSize: number;
  downloads: number;
  createdAt: string;
  downloadUrl: string;
};

function formatFileSize(bytes: number) {
  if (bytes <= 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const size = bytes / 1024 ** exponent;
  return `${size.toFixed(size >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

function normalizeCourseValue(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function CoursePage({ course, departmentId, departmentName, onBack }: CoursePageProps) {
  const [query, setQuery] = useState("");
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadResources = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const fetchResources = async (params: URLSearchParams) => {
          const response = await fetch(`${API_BASE_URL}/api/resources?${params.toString()}`);
          if (!response.ok) {
            throw new Error("Unable to load resources for this course.");
          }

          return (await response.json()) as ResourceItem[];
        };

        let payload = await fetchResources(
          new URLSearchParams({
            departmentSlug: departmentId,
            courseCode: course.id,
          }),
        );

        if (payload.length === 0 && course.code !== course.id) {
          payload = await fetchResources(
            new URLSearchParams({
              departmentSlug: departmentId,
              courseCode: course.code,
            }),
          );
        }

        if (payload.length === 0) {
          const departmentResources = await fetchResources(
            new URLSearchParams({
              departmentSlug: departmentId,
            }),
          );
          const normalizedCourseName = normalizeCourseValue(course.name);
          const normalizedCourseCode = normalizeCourseValue(course.code);

          payload = departmentResources.filter((resource) => {
            const resourceTitle = normalizeCourseValue(resource.courseTitle);
            const resourceCode = normalizeCourseValue(resource.courseCode);

            return (
              resourceCode === normalizedCourseCode ||
              (resourceTitle.length > 0 &&
                (resourceTitle.includes(normalizedCourseName) ||
                  normalizedCourseName.includes(resourceTitle)))
            );
          });
        }

        setResources(payload);
      } catch {
        setError("Unable to connect to the resources API.");
        setResources([]);
      } finally {
        setIsLoading(false);
      }
    };

    void loadResources();
  }, [course.id, departmentId]);

  const filteredPastPapers = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return resources.filter((resource) => {
      if (resource.resourceTypeLabel !== "Past Paper") return false;
      if (!normalized) return true;

      return (
        resource.title.toLowerCase().includes(normalized) ||
        resource.description.toLowerCase().includes(normalized) ||
        resource.fileName.toLowerCase().includes(normalized)
      );
    });
  }, [query, resources]);

  const filteredDocuments = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return resources.filter((resource) => {
      if (resource.resourceTypeLabel !== "Document") return false;
      if (!normalized) return true;

      return (
        resource.title.toLowerCase().includes(normalized) ||
        resource.description.toLowerCase().includes(normalized) ||
        resource.fileName.toLowerCase().includes(normalized)
      );
    });
  }, [query, resources]);

  const renderResources = (items: ResourceItem[], emptyMessage: string) => {
    if (isLoading) {
      return <Card className="p-8 text-center text-slate-500">Loading resources...</Card>;
    }

    if (error) {
      return <Card className="p-8 text-center text-red-600">{error}</Card>;
    }

    if (items.length === 0) {
      return <Card className="p-8 text-center text-slate-500">{emptyMessage}</Card>;
    }

    return items.map((resource) => (
      <Card key={resource.id} className="p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              {resource.resourceTypeLabel} · {new Date(resource.createdAt).toLocaleDateString()}
            </p>
            <h3 className="text-lg font-semibold text-slate-900">{resource.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{resource.description || "No description"}</p>
            <p className="mt-2 text-xs text-slate-500">
              {resource.fileName} · {formatFileSize(resource.fileSize)} · {resource.downloads} downloads
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row md:self-start">
            <Button asChild variant="outline" className="gap-2">
              <a
                href={`${API_BASE_URL}${resource.downloadUrl.replace(/\/download$/, "/view")}`}
                target="_blank"
                rel="noreferrer"
              >
                <Eye className="size-4" />
                View
              </a>
            </Button>
            <Button asChild className="gap-2">
              <a href={`${API_BASE_URL}${resource.downloadUrl}`} download>
                <Download className="size-4" />
                Download
              </a>
            </Button>
          </div>
        </div>
      </Card>
    ));
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <div className="mb-3 flex items-center gap-4">
              <Button variant="ghost" className="gap-2" onClick={onBack}>
                <ChevronLeft className="size-4" />
                Back to {departmentName}
              </Button>
            </div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{course.code}</p>
            <h2 className="text-4xl text-gray-900">{course.name}</h2>
            <p className="mt-2 text-lg text-gray-600">{course.description}</p>
          </div>
          <div className="flex size-16 items-center justify-center rounded-2xl bg-slate-900/5 shadow-sm">
            <course.icon className="size-8 text-slate-700" />
          </div>
        </div>

        <Tabs defaultValue="past-papers" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="past-papers">Past papers</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <Card className="mt-6 p-4 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search by title, description, or filename..."
                  className="pl-9"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
            </div>
          </Card>

          <TabsContent value="past-papers" className="mt-6 space-y-4">
            {renderResources(filteredPastPapers, "No past papers found for this course.")}
          </TabsContent>
          <TabsContent value="documents" className="mt-6 space-y-4">
            {renderResources(filteredDocuments, "No documents found for this course.")}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
