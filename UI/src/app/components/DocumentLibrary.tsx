import { useEffect, useMemo, useState } from "react";
import { DocumentCard, Document } from "./DocumentCard";
import { FilterBar, FilterState } from "./FilterBar";
import { API_BASE_URL } from "../lib/api";

type ResourceItem = {
  id: number;
  title: string;
  resourceTypeLabel: string;
  courseCode: string;
  courseTitle: string;
  departmentName: string;
  fileName: string;
  downloads: number;
  createdAt: string;
  downloadUrl: string;
};

function mapResourceType(type: string): Document["type"] {
  return type === "Past Paper" ? "Past Paper" : "Lecture Notes";
}

function mapResourceToDocument(resource: ResourceItem): Document {
  const createdAt = new Date(resource.createdAt);
  const year = Number.isNaN(createdAt.getTime()) ? "All Years" : String(createdAt.getFullYear());
  const downloadUrl = `${API_BASE_URL}${resource.downloadUrl}`;

  return {
    id: String(resource.id),
    title: resource.title,
    subject: resource.departmentName || resource.courseTitle || "General",
    type: mapResourceType(resource.resourceTypeLabel),
    year,
    semester: "All Semesters",
    uploadedBy: resource.courseCode || "StudySphere",
    uploadDate: resource.createdAt,
    downloads: resource.downloads,
    pages: 0,
    fileName: resource.fileName,
    downloadUrl,
    viewUrl: downloadUrl.replace(/\/download$/, "/view"),
  };
}

export function DocumentLibrary() {
  const [filters, setFilters] = useState<FilterState>({
    subject: "All Subjects",
    type: "All Types",
    year: "All Years",
    semester: "All Semesters",
  });
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDocuments = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/api/resources`);
        if (!response.ok) {
          setError("Unable to load the document listing.");
          setDocuments([]);
          return;
        }

        const payload = (await response.json()) as ResourceItem[];
        setDocuments(payload.map(mapResourceToDocument));
      } catch {
        setError("Unable to connect to the resources API.");
        setDocuments([]);
      } finally {
        setIsLoading(false);
      }
    };

    void loadDocuments();
  }, []);

  const filteredDocuments = useMemo(
    () =>
      documents.filter((doc) => {
        if (filters.subject !== "All Subjects" && doc.subject !== filters.subject) return false;
        if (filters.type !== "All Types" && doc.type !== filters.type) return false;
        if (filters.year !== "All Years" && doc.year !== filters.year) return false;
        if (filters.semester !== "All Semesters" && doc.semester !== filters.semester) return false;
        return true;
      }),
    [documents, filters],
  );

  return (
    <section id="documents" className="py-16 scroll-mt-24">
      <div className="container mx-auto px-4">
        <div id="library" className="scroll-mt-24" />
        <div id="past-papers" className="scroll-mt-24" />
        <div className="mb-8">
          <h2 className="text-4xl mb-2 text-gray-900">Document Library</h2>
          <p className="text-xl text-gray-600">
            Browse and download study materials for your courses
          </p>
        </div>

        <FilterBar onFilterChange={setFilters} />

        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{filteredDocuments.length}</span> documents
            </p>
          </div>

          {isLoading && (
            <div className="text-center py-12 text-gray-600">Loading documents...</div>
          )}

          {!isLoading && error && (
            <div className="text-center py-12 text-red-600">{error}</div>
          )}

          {!isLoading && !error && filteredDocuments.length > 0 && (
            <div className="space-y-4">
              {filteredDocuments.map((document) => (
                <DocumentCard key={document.id} document={document} />
              ))}
            </div>
          )}

          {!isLoading && !error && filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">
                No documents found matching your filters.
              </p>
              <p className="text-gray-500 mt-2">Try adjusting your filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
