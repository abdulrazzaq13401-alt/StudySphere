import { FormEvent, useEffect, useMemo, useState } from "react";
import { BookOpen, Plus, Search } from "lucide-react";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { API_BASE_URL, parseApiError } from "../lib/api";

type CourseItem = {
  id: number;
  code: string;
  title: string;
  departmentId: number;
  departmentName: string;
  instructorId: number;
  instructorName: string;
  semesterId: number | null;
  semesterName: string;
  resourceCount: number;
};

type LookupData = {
  departments: { id: number; name: string }[];
  instructors: { id: number; fullName: string; email: string }[];
  semesters: { id: number; name: string }[];
};

type CourseForm = {
  code: string;
  title: string;
  departmentId: string;
  instructorId: string;
  semesterId: string;
};

function makeDefaultForm(): CourseForm {
  return {
    code: "",
    title: "",
    departmentId: "",
    instructorId: "",
    semesterId: "none",
  };
}

export function AdminCourseManager() {
  const [courseItems, setCourseItems] = useState<CourseItem[]>([]);
  const [lookupData, setLookupData] = useState<LookupData>({
    departments: [],
    instructors: [],
    semesters: [],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [editorMode, setEditorMode] = useState<"create" | "edit">("create");
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CourseItem | null>(null);
  const [form, setForm] = useState<CourseForm>(makeDefaultForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    setPageError(null);

    try {
      const [coursesResponse, lookupResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/courses`),
        fetch(`${API_BASE_URL}/api/courses/lookup-data`),
      ]);

      if (!coursesResponse.ok) {
        setPageError(await parseApiError(coursesResponse));
        return;
      }

      if (!lookupResponse.ok) {
        setPageError(await parseApiError(lookupResponse));
        return;
      }

      const [coursesPayload, lookupPayload] = await Promise.all([
        coursesResponse.json() as Promise<CourseItem[]>,
        lookupResponse.json() as Promise<LookupData>,
      ]);

      setCourseItems(coursesPayload);
      setLookupData(lookupPayload);
    } catch {
      setPageError("Unable to connect to the courses API.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return courseItems.filter((course) => {
      const matchesDepartment =
        departmentFilter === "all" || String(course.departmentId) === departmentFilter;
      const matchesQuery =
        !query ||
        course.title.toLowerCase().includes(query) ||
        course.code.toLowerCase().includes(query) ||
        course.departmentName.toLowerCase().includes(query) ||
        course.instructorName.toLowerCase().includes(query);

      return matchesDepartment && matchesQuery;
    });
  }, [courseItems, departmentFilter, searchQuery]);

  const totalResources = useMemo(
    () => courseItems.reduce((sum, course) => sum + course.resourceCount, 0),
    [courseItems],
  );

  const openCreateDialog = () => {
    setEditorMode("create");
    setEditingCourseId(null);
    setForm({
      code: "",
      title: "",
      departmentId: lookupData.departments[0] ? String(lookupData.departments[0].id) : "",
      instructorId: lookupData.instructors[0] ? String(lookupData.instructors[0].id) : "",
      semesterId: "none",
    });
    setFormError(null);
    setIsEditorOpen(true);
  };

  const openEditDialog = (course: CourseItem) => {
    setEditorMode("edit");
    setEditingCourseId(course.id);
    setForm({
      code: course.code,
      title: course.title,
      departmentId: String(course.departmentId),
      instructorId: String(course.instructorId),
      semesterId: course.semesterId ? String(course.semesterId) : "none",
    });
    setFormError(null);
    setIsEditorOpen(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const code = form.code.trim().toUpperCase();
    const title = form.title.trim();
    const departmentId = Number(form.departmentId);
    const instructorId = Number(form.instructorId);
    const semesterId = form.semesterId === "none" ? null : Number(form.semesterId);

    if (!code) {
      setFormError("Course code is required.");
      return;
    }

    if (!title) {
      setFormError("Course title is required.");
      return;
    }

    if (!departmentId) {
      setFormError("Department is required.");
      return;
    }

    if (!instructorId) {
      setFormError("Instructor is required.");
      return;
    }

    setIsSaving(true);
    setFormError(null);

    try {
      const response = await fetch(
        editorMode === "create"
          ? `${API_BASE_URL}/api/courses`
          : `${API_BASE_URL}/api/courses/${editingCourseId}`,
        {
          method: editorMode === "create" ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
            title,
            departmentId,
            instructorId,
            semesterId,
          }),
        },
      );

      if (!response.ok) {
        setFormError(await parseApiError(response));
        return;
      }

      const payload = (await response.json()) as CourseItem;
      setCourseItems((current) => {
        if (editorMode === "create") {
          return [payload, ...current];
        }

        return current.map((course) => (course.id === payload.id ? payload : course));
      });
      setIsEditorOpen(false);
      setForm(makeDefaultForm());
    } catch {
      setFormError("Unable to connect to the courses API.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    setFormError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/courses/${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setFormError(await parseApiError(response));
        return;
      }

      setCourseItems((current) => current.filter((course) => course.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      setFormError("Unable to connect to the courses API.");
    } finally {
      setIsDeleting(false);
    }
  };

  const selectedDepartmentName =
    lookupData.departments.find((department) => String(department.id) === form.departmentId)?.name ??
    "Choose department";

  return (
    <section
      id="courses-admin"
      className="rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.65)] backdrop-blur md:p-8"
    >
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-slate-500">
            Course Administration
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-950">
            Manage courses with live department and instructor mappings
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Courses are loaded from the database and persisted through the API, including department,
            instructor, and semester relationships.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative min-w-[240px]">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by code, title, or instructor"
              className="pl-9"
            />
          </div>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="min-w-[220px]">
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All departments</SelectItem>
              {lookupData.departments.map((department) => (
                <SelectItem key={department.id} value={String(department.id)}>
                  {department.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="button" onClick={openCreateDialog} disabled={lookupData.departments.length === 0 || lookupData.instructors.length === 0}>
            <Plus />
            Add Course
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Courses</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{courseItems.length}</p>
          <p className="mt-1 text-sm text-slate-600">All courses currently stored in the database.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Departments covered</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">
            {new Set(courseItems.map((course) => course.departmentId)).size}
          </p>
          <p className="mt-1 text-sm text-slate-600">Useful for spotting gaps in department coverage.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Resources linked</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{totalResources}</p>
          <p className="mt-1 text-sm text-slate-600">Delete is blocked when a course still has resources.</p>
        </div>
      </div>

      {pageError && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {pageError}
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="px-4">Course</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Semester</TableHead>
              <TableHead>Resources</TableHead>
              <TableHead className="px-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                  Loading courses from the API...
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                        <BookOpen className="size-5" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{course.title}</p>
                        <p className="text-xs text-slate-500">{course.code}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{course.departmentName}</TableCell>
                  <TableCell>{course.instructorName}</TableCell>
                  <TableCell>{course.semesterName || "Not assigned"}</TableCell>
                  <TableCell>{course.resourceCount}</TableCell>
                  <TableCell className="px-4">
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => openEditDialog(course)}>
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setFormError(null);
                          setDeleteTarget(course);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

            {!isLoading && filteredCourses.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                  No courses match the current filter. Try another search or create a new course.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={isEditorOpen}
        onOpenChange={(open) => {
          setIsEditorOpen(open);
          if (!open) {
            setFormError(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editorMode === "create" ? "Create course" : "Update course"}</DialogTitle>
            <DialogDescription>
              Course changes are persisted through the API and linked to real department, instructor,
              and semester records.
            </DialogDescription>
          </DialogHeader>

          <form className="grid gap-6" onSubmit={(event) => void handleSubmit(event)}>
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label htmlFor="course-code" className="text-sm font-medium text-slate-700">
                    Course code
                  </label>
                  <Input
                    id="course-code"
                    value={form.code}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, code: event.target.value.toUpperCase() }))
                    }
                    placeholder="CS101"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="course-title" className="text-sm font-medium text-slate-700">
                    Course title
                  </label>
                  <Input
                    id="course-title"
                    value={form.title}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, title: event.target.value }))
                    }
                    placeholder="Introduction to Programming"
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Department</label>
                    <Select
                      value={form.departmentId}
                      onValueChange={(value) =>
                        setForm((current) => ({ ...current, departmentId: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose department" />
                      </SelectTrigger>
                      <SelectContent>
                        {lookupData.departments.map((department) => (
                          <SelectItem key={department.id} value={String(department.id)}>
                            {department.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Instructor</label>
                    <Select
                      value={form.instructorId}
                      onValueChange={(value) =>
                        setForm((current) => ({ ...current, instructorId: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose instructor" />
                      </SelectTrigger>
                      <SelectContent>
                        {lookupData.instructors.map((instructor) => (
                          <SelectItem key={instructor.id} value={String(instructor.id)}>
                            {instructor.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Semester</label>
                  <Select
                    value={form.semesterId}
                    onValueChange={(value) =>
                      setForm((current) => ({ ...current, semesterId: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No semester</SelectItem>
                      {lookupData.semesters.map((semester) => (
                        <SelectItem key={semester.id} value={String(semester.id)}>
                          {semester.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-600">Preview</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex size-14 items-center justify-center rounded-3xl bg-slate-900 text-white">
                    <BookOpen className="size-7" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{form.title || "Course title"}</p>
                    <p className="text-sm text-slate-500">{form.code || "COURSE101"}</p>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Department</p>
                  <p className="mt-1 text-sm font-medium text-slate-950">{selectedDepartmentName}</p>
                </div>
              </div>
            </div>

            {formError && <p className="text-sm text-red-600">{formError}</p>}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditorOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving
                  ? editorMode === "create"
                    ? "Creating..."
                    : "Saving..."
                  : editorMode === "create"
                    ? "Create Course"
                    : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
            setFormError(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete course</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `Delete ${deleteTarget.title}? Courses with linked resources cannot be removed.`
                : "Delete this course?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {formError && <p className="text-sm text-red-600">{formError}</p>}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={(event) => {
                event.preventDefault();
                void handleDelete();
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
