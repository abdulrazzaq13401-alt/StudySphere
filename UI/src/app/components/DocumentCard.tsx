import { FileText, Download, Eye, Calendar, User } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";

export interface Document {
  id: string;
  title: string;
  subject: string;
  type: "Past Paper" | "Lecture Notes" | "Assignment" | "Study Guide" | "Textbook";
  year: string;
  semester: string;
  uploadedBy: string;
  uploadDate: string;
  downloads: number;
  pages: number;
}

interface DocumentCardProps {
  document: Document;
}

export function DocumentCard({ document }: DocumentCardProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Past Paper":
        return "bg-blue-100 text-blue-700";
      case "Lecture Notes":
        return "bg-green-100 text-green-700";
      case "Assignment":
        return "bg-purple-100 text-purple-700";
      case "Study Guide":
        return "bg-orange-100 text-orange-700";
      case "Textbook":
        return "bg-pink-100 text-pink-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Card className="p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="size-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
          <FileText className="size-6 text-blue-600" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {document.title}
            </h3>
            <Badge className={getTypeColor(document.type)}>
              {document.type}
            </Badge>
          </div>

          <p className="text-sm text-gray-600 mb-3">{document.subject}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1">
              <Calendar className="size-4" />
              {document.year} - {document.semester}
            </span>
            <span className="flex items-center gap-1">
              <User className="size-4" />
              {document.uploadedBy}
            </span>
            <span>{document.pages} pages</span>
            <span>{document.downloads} downloads</span>
          </div>

          <div className="flex gap-2">
            <Button size="sm" className="flex-1 sm:flex-initial">
              <Download className="size-4 mr-2" />
              Download
            </Button>
            <Button size="sm" variant="outline">
              <Eye className="size-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
