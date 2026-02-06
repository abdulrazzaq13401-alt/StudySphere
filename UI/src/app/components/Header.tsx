import { User } from "lucide-react";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";

type HeaderProps = {
  onHomeClick?: () => void;
};

export function Header({ onHomeClick }: HeaderProps) {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            type="button"
            className="flex items-center gap-3 text-left"
            onClick={onHomeClick}
          >
            <SidebarTrigger className="hidden md:inline-flex" />
            <div className="relative grid size-9 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-400 shadow-[0_12px_32px_rgba(56,189,248,0.35)]">
              <span className="font-logo text-lg font-semibold text-white">S</span>
              <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-amber-300 shadow-[0_0_0_2px_rgba(255,255,255,0.6)]" />
            </div>
            <div className="leading-none">
              <span className="font-logo text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-sky-700 to-emerald-600">
                StudySphere
              </span>
              <span className="block text-[11px] uppercase tracking-[0.2em] text-slate-500">
                Learn Better
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#home" className="text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </a>
            <a href="#documents" className="text-gray-700 hover:text-blue-600 transition-colors">
              Documents
            </a>
            <a href="#departments" className="text-gray-700 hover:text-blue-600 transition-colors">
              Departments
            </a>
            <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">
              About
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <User className="size-5" />
            </Button>
            <Button className="hidden md:flex">Upload Document</Button>
            <SidebarTrigger className="md:hidden" />
          </div>
        </div>
      </div>
    </header>
  );
}
