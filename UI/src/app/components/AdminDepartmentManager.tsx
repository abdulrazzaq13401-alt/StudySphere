import { FormEvent, useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Briefcase,
  Calculator,
  Cpu,
  FlaskConical,
  GraduationCap,
  HeartPulse,
  Landmark,
  Leaf,
  LineChart,
  Palette,
  Plus,
  Scale,
  Search,
  Shield,
  TrendingUp,
} from "lucide-react";

import { Badge } from "./ui/badge";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { API_BASE_URL } from "../lib/api";

type DepartmentForm = {
  name: string;
  slug: string;
};

type ApiDepartment = {
  id: number;
  name: string;
  slug: string;
  courseCount: number;
  resourceCount: number;
};

type DepartmentViewModel = ApiDepartment & {
  icon: LucideIcon;
  color: string;
};

const iconOptions: LucideIcon[] = [
  Cpu,
  Calculator,
  TrendingUp,
  FlaskConical,
  Leaf,
  Briefcase,
  LineChart,
  HeartPulse,
  Scale,
  Palette,
  Shield,
  Landmark,
  GraduationCap,
  BookOpen,
];

const colorOptions = [
  { value: "bg-blue-500", label: "Ocean Blue" },
  { value: "bg-emerald-500", label: "Emerald" },
  { value: "bg-orange-500", label: "Amber Orange" },
  { value: "bg-pink-500", label: "Rose Pink" },
  { value: "bg-teal-500", label: "Teal" },
  { value: "bg-indigo-500", label: "Indigo" },
  { value: "bg-red-500", label: "Red" },
  { value: "bg-slate-600", label: "Slate" },
  { value: "bg-fuchsia-500", label: "Fuchsia" },
  { value: "bg-lime-600", label: "Lime" },
  { value: "bg-sky-600", label: "Sky" },
  { value: "bg-amber-600", label: "Gold" },
  { value: "bg-cyan-600", label: "Cyan" },
] as const;

function makeDefaultForm(): DepartmentForm {
  return {
    name: "",
    slug: "",
  };
}

function slugifyDepartment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapDepartmentToViewModel(department: ApiDepartment): DepartmentViewModel {
  const hashBase = `${department.id}-${department.slug}`;
  const hash = Array.from(hashBase).reduce((sum, character) => sum + character.charCodeAt(0), 0);

  return {
    ...department,
    icon: iconOptions[hash % iconOptions.length],
    color: colorOptions[hash % colorOptions.length].value,
  };
}

async function parseErrorMessage(response: Response) {
  const payload = (await response.json().catch(() => null)) as { message?: string } | null;
  return payload?.message ?? "Request failed.";
}

export function AdminDepartmentManager() {
  const [departmentItems, setDepartmentItems] = useState<ApiDepartment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editorMode, setEditorMode] = useState<"create" | "edit">("create");
  const [editingDepartmentId, setEditingDepartmentId] = useState<number | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ApiDepartment | null>(null);
  const [form, setForm] = useState<DepartmentForm>(makeDefaultForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadDepartments = async () => {
    setIsLoading(true);
    setPageError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/departments`);
      if (!response.ok) {
        setPageError(await parseErrorMessage(response));
        return;
      }

      const payload = (await response.json()) as ApiDepartment[];
      setDepartmentItems(payload);
    } catch {
      setPageError("Unable to connect to the departments API.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadDepartments();
  }, []);

  const viewDepartments = useMemo(
    () => departmentItems.map(mapDepartmentToViewModel),
    [departmentItems],
  );

  const filteredDepartments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return viewDepartments;

    return viewDepartments.filter((department) => {
      return (
        department.name.toLowerCase().includes(query) ||
        department.slug.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, viewDepartments]);

  const totalCourses = useMemo(
    () => departmentItems.reduce((sum, department) => sum + department.courseCount, 0),
    [departmentItems],
  );

  const totalDocuments = useMemo(
    () => departmentItems.reduce((sum, department) => sum + department.resourceCount, 0),
    [departmentItems],
  );

  const previewDepartment = useMemo(
    () =>
      mapDepartmentToViewModel({
        id: editingDepartmentId ?? 0,
        name: form.name || "Department Name",
        slug: form.slug || "department-slug",
        courseCount: 0,
        resourceCount: 0,
      }),
    [editingDepartmentId, form.name, form.slug],
  );

  const PreviewIcon = previewDepartment.icon;

  const openCreateDialog = () => {
    setEditorMode("create");
    setEditingDepartmentId(null);
    setForm(makeDefaultForm());
    setFormError(null);
    setIsEditorOpen(true);
  };

  const openEditDialog = (department: ApiDepartment) => {
    setEditorMode("edit");
    setEditingDepartmentId(department.id);
    setForm({
      name: department.name,
      slug: department.slug,
    });
    setFormError(null);
    setIsEditorOpen(true);
  };

  const handleNameChange = (value: string) => {
    setForm((current) => {
      const shouldUpdateSlug =
        editorMode === "create" ||
        current.slug.length === 0 ||
        current.slug === slugifyDepartment(current.name);

      return {
        ...current,
        name: value,
        slug: shouldUpdateSlug ? slugifyDepartment(value) : current.slug,
      };
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = form.name.trim();
    const normalizedSlug = slugifyDepartment(form.slug || form.name);

    if (!trimmedName) {
      setFormError("Department name is required.");
      return;
    }

    if (!normalizedSlug) {
      setFormError("Department slug is required.");
      return;
    }

    setIsSaving(true);
    setFormError(null);

    try {
      const requestUrl =
        editorMode === "create"
          ? `${API_BASE_URL}/api/departments`
          : `${API_BASE_URL}/api/departments/${editingDepartmentId}`;
      const method = editorMode === "create" ? "POST" : "PUT";

      const response = await fetch(requestUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          slug: normalizedSlug,
        }),
      });

      if (!response.ok) {
        setFormError(await parseErrorMessage(response));
        return;
      }

      const payload = (await response.json()) as ApiDepartment;
      setDepartmentItems((current) => {
        if (editorMode === "create") {
          return [payload, ...current];
        }

        return current.map((department) =>
          department.id === payload.id ? payload : department,
        );
      });

      setIsEditorOpen(false);
      setForm(makeDefaultForm());
    } catch {
      setFormError("Unable to connect to the departments API.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    setFormError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/departments/${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setFormError(await parseErrorMessage(response));
        return;
      }

      setDepartmentItems((current) =>
        current.filter((department) => department.id !== deleteTarget.id),
      );
      setDeleteTarget(null);
    } catch {
      setFormError("Unable to connect to the departments API.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section
      id="departments"
      className="rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.65)] backdrop-blur md:p-8"
    >
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-slate-500">
            Department Administration
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-950">
            Keep department management in the same admin workspace
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Departments are now loaded from the database through the API, with create, update, and
            delete actions handled directly from this panel.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative min-w-[240px]">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by name or slug"
              className="pl-9"
            />
          </div>
          <Button type="button" onClick={openCreateDialog}>
            <Plus />
            Add Department
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Departments</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{departmentItems.length}</p>
          <p className="mt-1 text-sm text-slate-600">Stored in SQL Server and fetched by API.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Courses mapped</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{totalCourses}</p>
          <p className="mt-1 text-sm text-slate-600">Delete is blocked when a department still has courses.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Document count</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{totalDocuments}</p>
          <p className="mt-1 text-sm text-slate-600">Computed from resources linked through courses.</p>
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
              <TableHead className="px-4">Department</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Courses</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Theme</TableHead>
              <TableHead className="px-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isLoading &&
              filteredDepartments.map((department) => {
                const Icon = department.icon;

                return (
                  <TableRow key={department.id}>
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex size-10 items-center justify-center rounded-2xl ${department.color} text-white`}
                        >
                          <Icon className="size-5" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{department.name}</p>
                          <p className="text-xs text-slate-500">Visible in the department catalog</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{department.slug}</TableCell>
                    <TableCell>{department.courseCount}</TableCell>
                    <TableCell>{department.resourceCount}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="gap-2 border-slate-300 text-slate-700">
                        <span className={`size-2.5 rounded-full ${department.color}`} />
                        {colorOptions.find((option) => option.value === department.color)?.label ?? "Custom"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4">
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => openEditDialog(department)}>
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setFormError(null);
                            setDeleteTarget(department);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}

            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                  Loading departments from the API...
                </TableCell>
              </TableRow>
            )}

            {!isLoading && filteredDepartments.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                  No departments match your search. Try a different keyword or create a new department.
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
            <DialogTitle>
              {editorMode === "create" ? "Create department" : "Update department"}
            </DialogTitle>
            <DialogDescription>
              Department changes are persisted through the API and saved to the database.
            </DialogDescription>
          </DialogHeader>

          <form className="grid gap-6" onSubmit={(event) => void handleSubmit(event)}>
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label htmlFor="department-name" className="text-sm font-medium text-slate-700">
                    Department name
                  </label>
                  <Input
                    id="department-name"
                    value={form.name}
                    onChange={(event) => handleNameChange(event.target.value)}
                    placeholder="Computer Science"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="department-slug" className="text-sm font-medium text-slate-700">
                    Slug
                  </label>
                  <Input
                    id="department-slug"
                    value={form.slug}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        slug: slugifyDepartment(event.target.value),
                      }))
                    }
                    placeholder="computer-science"
                    required
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-600">Preview</p>
                <div className="mt-4 flex items-center gap-3">
                  <div
                    className={`flex size-14 items-center justify-center rounded-3xl ${previewDepartment.color} text-white`}
                  >
                    <PreviewIcon className="size-7" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{previewDepartment.name}</p>
                    <p className="text-sm text-slate-500">{previewDepartment.slug}</p>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Database</p>
                  <p className="mt-1 text-sm font-medium text-slate-950">
                    Name and slug are editable here. Course and document totals are read-only API counts.
                  </p>
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
                    ? "Create Department"
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
            <AlertDialogTitle>Delete department</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `Delete ${deleteTarget.name}? Departments with linked courses cannot be removed.`
                : "Delete this department?"}
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
