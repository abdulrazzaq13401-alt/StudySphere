import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { FileText, Plus, Search } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { API_BASE_URL, parseApiError } from "../lib/api";

type ResourceType = "Document" | "PastPaper";

type ResourceItem = {
  id: number;
  title: string;
  description: string;
  resourceType: number;
  resourceTypeLabel: string;
  courseId: number;
  courseCode: string;
  courseTitle: string;
  departmentId: number;
  departmentName: string;
  departmentSlug: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  downloads: number;
  createdAt: string;
  downloadUrl: string;
};

type LookupData = {
  departments: { id: number; name: string }[];
  courses: {
    id: number;
    code: string;
    title: string;
    departmentId: number;
    departmentName: string;
  }[];
};

type ResourceForm = {
  title: string;
  description: string;
  departmentId: string;
  resourceType: ResourceType;
  courseId: string;
  file: File | null;
  existingFileName: string;
};

function makeDefaultForm(): ResourceForm {
  return {
    title: "",
    description: "",
    departmentId: "",
    resourceType: "Document",
    courseId: "",
    file: null,
    existingFileName: "",
  };
}

function formatFileSize(bytes: number) {
  if (bytes <= 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const size = bytes / 1024 ** exponent;
  return `${size.toFixed(size >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

export function AdminResourceManager() {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [lookupData, setLookupData] = useState<LookupData>({ departments: [], courses: [] });
  const [searchName, setSearchName] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [resourceTypeFilter, setResourceTypeFilter] = useState("all");
  const [editorMode, setEditorMode] = useState<"create" | "edit">("create");
  const [editingResourceId, setEditingResourceId] = useState<number | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ResourceItem | null>(null);
  const [form, setForm] = useState<ResourceForm>(makeDefaultForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    setPageError(null);

    try {
      const [resourcesResponse, lookupResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/resources`),
        fetch(`${API_BASE_URL}/api/resources/lookup-data`),
      ]);

      if (!resourcesResponse.ok) {
        setPageError(await parseApiError(resourcesResponse));
        return;
      }

      if (!lookupResponse.ok) {
        setPageError(await parseApiError(lookupResponse));
        return;
      }

      const [resourcesPayload, lookupPayload] = await Promise.all([
        resourcesResponse.json() as Promise<ResourceItem[]>,
        lookupResponse.json() as Promise<LookupData>,
      ]);

      setResources(resourcesPayload);
      setLookupData(lookupPayload);
    } catch {
      setPageError("Unable to connect to the resources API.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const filteredCourses = useMemo(() => {
    if (departmentFilter === "all") {
      return lookupData.courses;
    }

    return lookupData.courses.filter((course) => String(course.departmentId) === departmentFilter);
  }, [departmentFilter, lookupData.courses]);

  const filteredResources = useMemo(() => {
    const query = searchName.trim().toLowerCase();

    return resources.filter((resource) => {
      const matchesDepartment =
        departmentFilter === "all" || String(resource.departmentId) === departmentFilter;
      const matchesCourse = courseFilter === "all" || String(resource.courseId) === courseFilter;
      const matchesType =
        resourceTypeFilter === "all" || resource.resourceTypeLabel === resourceTypeFilter;
      const matchesQuery =
        !query ||
        resource.title.toLowerCase().includes(query) ||
        resource.courseCode.toLowerCase().includes(query) ||
        resource.courseTitle.toLowerCase().includes(query) ||
        resource.departmentName.toLowerCase().includes(query);

      return matchesDepartment && matchesCourse && matchesType && matchesQuery;
    });
  }, [courseFilter, departmentFilter, resourceTypeFilter, resources, searchName]);

  const openCreateDialog = () => {
    setEditorMode("create");
    setEditingResourceId(null);
    const defaultDepartmentId = lookupData.departments[0]
      ? String(lookupData.departments[0].id)
      : "";
    const defaultCourse =
      lookupData.courses.find((course) => String(course.departmentId) === defaultDepartmentId) ??
      lookupData.courses[0];
    setForm({
      ...makeDefaultForm(),
      departmentId: defaultDepartmentId,
      courseId: defaultCourse ? String(defaultCourse.id) : "",
    });
    setFormError(null);
    setIsEditorOpen(true);
  };

  const openEditDialog = (resource: ResourceItem) => {
    setEditorMode("edit");
    setEditingResourceId(resource.id);
    setForm({
      title: resource.title,
      description: resource.description,
      departmentId: String(resource.departmentId),
      resourceType: resource.resourceType === 2 ? "PastPaper" : "Document",
      courseId: String(resource.courseId),
      file: null,
      existingFileName: resource.fileName,
    });
    setFormError(null);
    setIsEditorOpen(true);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;
    setForm((current) => ({ ...current, file: selectedFile }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fileTitle =
      form.file?.name.replace(/\.[^/.]+$/, "") ?? `Resource ${new Date().toLocaleDateString()}`;
    const title = form.title.trim() || fileTitle;
    const description = form.description.trim();
    const courseId = Number(form.courseId);

    if (!courseId) {
      setFormError("Course is required.");
      return;
    }

    if (editorMode === "create" && !form.file) {
      setFormError("Please select a file to upload.");
      return;
    }

    setIsSaving(true);
    setFormError(null);

    try {
      const payload = new FormData();
      payload.append("title", title);
      payload.append("description", description);
      payload.append("resourceType", form.resourceType);
      payload.append("courseId", String(courseId));
      if (form.file) {
        payload.append("file", form.file);
      }

      const response = await fetch(
        editorMode === "create"
          ? `${API_BASE_URL}/api/resources`
          : `${API_BASE_URL}/api/resources/${editingResourceId}`,
        {
          method: editorMode === "create" ? "POST" : "PUT",
          body: payload,
        },
      );

      if (!response.ok) {
        setFormError(await parseApiError(response));
        return;
      }

      const item = (await response.json()) as ResourceItem;
      setResources((current) => {
        if (editorMode === "create") {
          return [item, ...current];
        }

        return current.map((resource) => (resource.id === item.id ? item : resource));
      });

      setIsEditorOpen(false);
      setForm(makeDefaultForm());
    } catch {
      setFormError("Unable to connect to the resources API.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    setFormError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/resources/${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setFormError(await parseApiError(response));
        return;
      }

      setResources((current) => current.filter((resource) => resource.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      setFormError("Unable to connect to the resources API.");
    } finally {
      setIsDeleting(false);
    }
  };

  const selectedCourse = lookupData.courses.find((course) => String(course.id) === form.courseId);
  const formCourses = useMemo(() => {
    if (!form.departmentId) {
      return lookupData.courses;
    }

    return lookupData.courses.filter(
      (course) => String(course.departmentId) === form.departmentId,
    );
  }, [form.departmentId, lookupData.courses]);

  return (
    <section
      id="resources-admin"
      className="rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.65)] backdrop-blur md:p-8"
    >
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-slate-500">
            Resource Administration
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-950">
            Manage documents and past papers with physical file storage
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Upload, edit, and delete resources, then filter by department, course, name, and resource
            type.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <div className="relative min-w-[240px]">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchName}
              onChange={(event) => setSearchName(event.target.value)}
              placeholder="Search by name, course, or department"
              className="pl-9"
            />
          </div>
          <Select
            value={departmentFilter}
            onValueChange={(value) => {
              setDepartmentFilter(value);
              setCourseFilter("all");
            }}
          >
            <SelectTrigger className="min-w-[200px]">
              <SelectValue placeholder="Department" />
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
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="min-w-[200px]">
              <SelectValue placeholder="Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All courses</SelectItem>
              {filteredCourses.map((course) => (
                <SelectItem key={course.id} value={String(course.id)}>
                  {course.code} - {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={resourceTypeFilter} onValueChange={setResourceTypeFilter}>
            <SelectTrigger className="min-w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="Document">Document</SelectItem>
              <SelectItem value="Past Paper">Past Paper</SelectItem>
            </SelectContent>
          </Select>
          <Button type="button" onClick={openCreateDialog}>
            <Plus />
            Add
          </Button>
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
              <TableHead className="px-4">Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>File</TableHead>
              <TableHead>Downloads</TableHead>
              <TableHead className="px-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={7} className="px-4 py-10 text-center text-sm text-slate-500">
                  Loading resources from the API...
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              filteredResources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell className="px-4 py-4">
                    <p className="font-medium text-slate-900">{resource.title}</p>
                    <p className="text-xs text-slate-500">{resource.description || "No description"}</p>
                  </TableCell>
                  <TableCell>{resource.resourceTypeLabel}</TableCell>
                  <TableCell>{resource.departmentName}</TableCell>
                  <TableCell>
                    {resource.courseCode} - {resource.courseTitle}
                  </TableCell>
                  <TableCell>
                    <p className="line-clamp-1 text-sm text-slate-700" title={resource.fileName}>
                      {resource.fileName}
                    </p>
                    <p className="text-xs text-slate-500">{formatFileSize(resource.fileSize)}</p>
                  </TableCell>
                  <TableCell>{resource.downloads}</TableCell>
                  <TableCell className="px-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(resource)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setFormError(null);
                          setDeleteTarget(resource);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

            {!isLoading && filteredResources.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="px-4 py-10 text-center text-sm text-slate-500">
                  No resources match the current filters.
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
            <DialogTitle>{editorMode === "create" ? "Create a Document" : "Update Document"}</DialogTitle>
            <DialogDescription>
              Assign each resource to a course and classify it as a document or past paper.
            </DialogDescription>
          </DialogHeader>

          <form className="grid gap-6" onSubmit={(event) => void handleSubmit(event)}>
            {(lookupData.departments.length === 0 || lookupData.courses.length === 0) && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                You need at least one department and one course before adding resources.
              </div>
            )}
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_260px]">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="resource-description">Description</Label>
                  <Input
                    id="resource-description"
                    value={form.description}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, description: event.target.value }))
                    }
                    placeholder="Optional summary"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Select
                      value={form.departmentId}
                      onValueChange={(value) =>
                        setForm((current) => {
                          const nextCourse =
                            lookupData.courses.find((course) => String(course.departmentId) === value) ??
                            null;
                          return {
                            ...current,
                            departmentId: value,
                            courseId: nextCourse ? String(nextCourse.id) : "",
                          };
                        })
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
                    <Label>Course</Label>
                    <Select
                      value={form.courseId}
                      onValueChange={(value) => setForm((current) => ({ ...current, courseId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose course" />
                      </SelectTrigger>
                      <SelectContent>
                        {formCourses.map((course) => (
                          <SelectItem key={course.id} value={String(course.id)}>
                            {course.code} - {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Resource Type</Label>
                    <Select
                      value={form.resourceType}
                      onValueChange={(value: ResourceType) =>
                        setForm((current) => ({ ...current, resourceType: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Document">Document</SelectItem>
                        <SelectItem value="PastPaper">Past Paper</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resource-file">
                    {editorMode === "create" ? "Upload file" : "Replace file (optional)"}
                  </Label>
                  <Input id="resource-file" type="file" onChange={handleFileChange} />
                  {editorMode === "edit" && form.existingFileName && !form.file && (
                    <p className="text-xs text-slate-500">Current file: {form.existingFileName}</p>
                  )}
                  {form.file && <p className="text-xs text-slate-500">Selected: {form.file.name}</p>}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-600">Preview</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex size-14 items-center justify-center rounded-3xl bg-slate-900 text-white">
                    <FileText className="size-7" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {form.title || form.file?.name || "Selected file name"}
                    </p>
                    <p className="text-sm text-slate-500">
                      {form.resourceType === "PastPaper" ? "Past Paper" : "Document"}
                    </p>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Course</p>
                  <p className="mt-1 text-sm font-medium text-slate-950">
                    {selectedCourse ? `${selectedCourse.code} - ${selectedCourse.title}` : "Choose course"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {selectedCourse?.departmentName ?? "Department not selected"}
                  </p>
                </div>
              </div>
            </div>

            {formError && <p className="text-sm text-red-600">{formError}</p>}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditorOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isSaving || lookupData.departments.length === 0 || lookupData.courses.length === 0
                }
              >
                {isSaving
                  ? editorMode === "create"
                    ? "Creating..."
                    : "Saving..."
                  : editorMode === "create"
                    ? "Create Document"
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
            <AlertDialogTitle>Delete resource</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `Delete ${deleteTarget.title}? This also removes the physical file from storage.`
                : "Delete this resource?"}
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
