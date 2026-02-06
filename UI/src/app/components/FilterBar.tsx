import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";

interface FilterBarProps {
  onFilterChange?: (filters: FilterState) => void;
}

export interface FilterState {
  subject: string;
  type: string;
  year: string;
  semester: string;
}

const subjects = [
  "All Subjects",
  "Computer Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Engineering",
  "Business",
  "Economics",
  "Psychology",
  "English Literature"
];

const documentTypes = [
  "All Types",
  "Past Paper",
  "Lecture Notes",
  "Assignment",
  "Study Guide",
  "Textbook"
];

const years = ["All Years", "2024", "2023", "2022", "2021", "2020"];
const semesters = ["All Semesters", "Spring", "Fall", "Summer"];

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterState>({
    subject: "All Subjects",
    type: "All Types",
    year: "All Years",
    semester: "All Semesters"
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const activeFilterCount = Object.values(filters).filter(
    value => !value.startsWith("All")
  ).length;

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="size-5 text-gray-600" />
        <span className="font-semibold text-gray-900">Filters</span>
        {activeFilterCount > 0 && (
          <Badge variant="secondary">{activeFilterCount} active</Badge>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="text-sm text-gray-600 mb-2 block">Subject</label>
          <Select
            value={filters.subject}
            onValueChange={(value) => handleFilterChange("subject", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-2 block">Document Type</label>
          <Select
            value={filters.type}
            onValueChange={(value) => handleFilterChange("type", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {documentTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-2 block">Year</label>
          <Select
            value={filters.year}
            onValueChange={(value) => handleFilterChange("year", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-2 block">Semester</label>
          <Select
            value={filters.semester}
            onValueChange={(value) => handleFilterChange("semester", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {semesters.map((semester) => (
                <SelectItem key={semester} value={semester}>
                  {semester}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
