import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function Hero() {
  return (
    <section id="home" className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl mb-6 text-gray-900">
            Your Academic Resource Hub
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Access thousands of study materials, past papers, and course documents. 
            Everything you need for academic success in one place.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for documents, subjects, or past papers..."
                  className="pl-10 h-12"
                />
              </div>
              <Button className="h-12 px-8">Search</Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-semibold text-blue-600 mb-1">5000+</div>
              <div className="text-gray-600">Documents</div>
            </div>
            <div>
              <div className="text-3xl font-semibold text-blue-600 mb-1">50+</div>
              <div className="text-gray-600">Subjects</div>
            </div>
            <div>
              <div className="text-3xl font-semibold text-blue-600 mb-1">10k+</div>
              <div className="text-gray-600">Students</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
