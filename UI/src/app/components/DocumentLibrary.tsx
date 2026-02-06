import { useState } from "react";
import { DocumentCard, Document } from "./DocumentCard";
import { FilterBar, FilterState } from "./FilterBar";

const mockDocuments: Document[] = [
  {
    id: "1",
    title: "Data Structures and Algorithms - Final Exam 2023",
    subject: "Computer Science",
    type: "Past Paper",
    year: "2023",
    semester: "Fall",
    uploadedBy: "Prof. Johnson",
    uploadDate: "2024-01-15",
    downloads: 1243,
    pages: 12
  },
  {
    id: "2",
    title: "Calculus II - Complete Lecture Notes",
    subject: "Mathematics",
    type: "Lecture Notes",
    year: "2024",
    semester: "Spring",
    uploadedBy: "Dr. Smith",
    uploadDate: "2024-02-20",
    downloads: 892,
    pages: 156
  },
  {
    id: "3",
    title: "Quantum Mechanics - Study Guide",
    subject: "Physics",
    type: "Study Guide",
    year: "2023",
    semester: "Fall",
    uploadedBy: "Dr. Brown",
    uploadDate: "2023-11-10",
    downloads: 567,
    pages: 45
  },
  {
    id: "4",
    title: "Organic Chemistry Lab Manual",
    subject: "Chemistry",
    type: "Textbook",
    year: "2024",
    semester: "Spring",
    uploadedBy: "Prof. Davis",
    uploadDate: "2024-01-08",
    downloads: 723,
    pages: 234
  },
  {
    id: "5",
    title: "Database Systems - Assignment Solutions",
    subject: "Computer Science",
    type: "Assignment",
    year: "2023",
    semester: "Spring",
    uploadedBy: "TA Williams",
    uploadDate: "2023-05-15",
    downloads: 1456,
    pages: 28
  },
  {
    id: "6",
    title: "Linear Algebra - Midterm Exam 2024",
    subject: "Mathematics",
    type: "Past Paper",
    year: "2024",
    semester: "Spring",
    uploadedBy: "Prof. Martinez",
    uploadDate: "2024-03-12",
    downloads: 934,
    pages: 8
  },
  {
    id: "7",
    title: "Introduction to Psychology - Complete Notes",
    subject: "Psychology",
    type: "Lecture Notes",
    year: "2023",
    semester: "Fall",
    uploadedBy: "Dr. Anderson",
    uploadDate: "2023-12-05",
    downloads: 678,
    pages: 98
  },
  {
    id: "8",
    title: "Financial Accounting - Study Guide & Practice",
    subject: "Business",
    type: "Study Guide",
    year: "2024",
    semester: "Spring",
    uploadedBy: "Prof. Lee",
    uploadDate: "2024-02-28",
    downloads: 812,
    pages: 67
  },
  {
    id: "9",
    title: "Machine Learning - Final Project Guidelines",
    subject: "Computer Science",
    type: "Assignment",
    year: "2023",
    semester: "Fall",
    uploadedBy: "Dr. Chen",
    uploadDate: "2023-10-20",
    downloads: 1089,
    pages: 15
  }
];

export function DocumentLibrary() {
  const [filters, setFilters] = useState<FilterState>({
    subject: "All Subjects",
    type: "All Types",
    year: "All Years",
    semester: "All Semesters"
  });

  const filteredDocuments = mockDocuments.filter((doc) => {
    if (filters.subject !== "All Subjects" && doc.subject !== filters.subject) return false;
    if (filters.type !== "All Types" && doc.type !== filters.type) return false;
    if (filters.year !== "All Years" && doc.year !== filters.year) return false;
    if (filters.semester !== "All Semesters" && doc.semester !== filters.semester) return false;
    return true;
  });

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

          <div className="space-y-4">
            {filteredDocuments.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">
                No documents found matching your filters.
              </p>
              <p className="text-gray-500 mt-2">
                Try adjusting your filter criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
