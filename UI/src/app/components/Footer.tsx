import { Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-gray-300 py-12 scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div id="about" className="scroll-mt-24" />
            <div className="flex items-center gap-2 mb-4">
              <div className="relative grid size-9 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-400 shadow-[0_12px_32px_rgba(56,189,248,0.35)]">
                <span className="font-logo text-base font-semibold text-white">S</span>
                <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-amber-300 shadow-[0_0_0_2px_rgba(255,255,255,0.6)]" />
              </div>
              <span className="font-logo text-2xl text-white">StudySphere</span>
            </div>
            <p className="text-gray-400">
              Your comprehensive academic resource hub for university students.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="hover:text-blue-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#documents" className="hover:text-blue-400 transition-colors">
                  Documents
                </a>
              </li>
              <li>
                <a href="#departments" className="hover:text-blue-400 transition-colors">
                  Departments
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-blue-400 transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#past-papers" className="hover:text-blue-400 transition-colors">
                  Past Papers
                </a>
              </li>
              <li>
                <a href="#documents" className="hover:text-blue-400 transition-colors">
                  Lecture Notes
                </a>
              </li>
              <li>
                <a href="#documents" className="hover:text-blue-400 transition-colors">
                  Study Guides
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Mail className="size-4" />
                <span>info@studysphere.edu</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4" />
                <span>University Campus</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>© 2026 StudySphere. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
