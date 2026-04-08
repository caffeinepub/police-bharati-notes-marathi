import { Toaster } from "@/components/ui/sonner";
import { ChevronRight, Menu, Shield, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Topic } from "./backend.d";
import NotesContent from "./components/NotesContent";
import Sidebar from "./components/Sidebar";
import WelcomeScreen from "./components/WelcomeScreen";
import { FALLBACK_CATEGORIES, FALLBACK_TOPICS } from "./data/fallbackData";
import {
  useGetAllCategories,
  useGetTopicsByCategory,
  useSeedData,
} from "./hooks/useQueries";

// Auto-select first topic helper
function useAutoSelect(
  onSelect: (topic: Topic, category: string) => void,
  enabled: boolean,
) {
  const { data: categories = [] } = useGetAllCategories();
  const firstCategory = categories[0] ?? "";
  const { data: topics = [] } = useGetTopicsByCategory(firstCategory);
  const calledRef = useRef(false);

  useEffect(() => {
    if (enabled && !calledRef.current && topics.length > 0 && firstCategory) {
      calledRef.current = true;
      onSelect(topics[0], firstCategory);
    }
  }, [topics, firstCategory, enabled, onSelect]);
}

export default function App() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(
    FALLBACK_TOPICS[0] ?? null,
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    FALLBACK_TOPICS[0]?.category ?? FALLBACK_CATEGORIES[0] ?? "",
  );
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [hasManuallySelected, setHasManuallySelected] = useState(false);

  const { mutate: seedData } = useSeedData();
  const seedCalledRef = useRef(false);

  // Seed data on app load - once only
  useEffect(() => {
    if (!seedCalledRef.current) {
      seedCalledRef.current = true;
      seedData();
    }
  }, [seedData]);

  const handleTopicSelect = (topic: Topic, category?: string) => {
    setSelectedTopic(topic);
    setHasManuallySelected(true);
    if (category) setSelectedCategory(category);
    setMobileSidebarOpen(false);
  };

  // Auto-select from backend only if user hasn't manually selected
  useAutoSelect((topic, category) => {
    if (!hasManuallySelected) {
      setSelectedTopic(topic);
      setSelectedCategory(category);
    }
  }, !hasManuallySelected);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[270px] flex-shrink-0 h-full border-r border-sidebar-border">
        <Sidebar
          selectedTopic={selectedTopic}
          onTopicSelect={(topic) => handleTopicSelect(topic)}
          defaultExpandedCategory={selectedCategory}
        />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-[270px] flex flex-col lg:hidden"
            >
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                data-ocid="sidebar.close_button"
                className="absolute top-4 right-4 z-10 p-1.5 rounded-md text-[oklch(0.75_0.01_265)] hover:bg-[oklch(0.24_0.012_258)] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <Sidebar
                selectedTopic={selectedTopic}
                onTopicSelect={(topic) => handleTopicSelect(topic)}
                defaultExpandedCategory={selectedCategory}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 bg-white shadow-header border-b border-border h-16 flex items-center px-6 gap-4 z-10">
          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            data-ocid="header.menu.button"
            className="lg:hidden p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="मेनू उघडा"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <nav
            className="flex-1 flex items-center gap-1.5 text-sm min-w-0"
            aria-label="ब्रेडक्रम्ब"
          >
            {selectedCategory && (
              <>
                <span className="text-muted-foreground font-devanagari truncate">
                  {selectedCategory}
                </span>
                {selectedTopic && (
                  <>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="font-medium text-foreground font-devanagari truncate">
                      {selectedTopic.title}
                    </span>
                  </>
                )}
              </>
            )}
          </nav>

          {/* Right badge */}
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber/10 border border-amber/20">
              <Shield className="w-3.5 h-3.5 text-[oklch(0.55_0.14_60)]" />
              <span className="text-xs font-medium text-[oklch(0.40_0.10_60)] font-devanagari">
                पोलीस भरती परीक्षा नोट्स
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto" data-ocid="main.section">
          <div className="max-w-[1050px] mx-auto px-6 py-6">
            {selectedTopic ? (
              <NotesContent topic={selectedTopic} />
            ) : (
              <WelcomeScreen />
            )}
          </div>

          {/* Footer */}
          <footer className="mt-auto px-6 py-6 border-t border-border bg-white">
            <div className="max-w-[1050px] mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-md bg-amber flex items-center justify-center">
                      <Shield className="w-3.5 h-3.5 text-[oklch(0.12_0.005_265)]" />
                    </div>
                    <span className="font-bold text-sm font-devanagari text-[oklch(0.18_0.005_265)]">
                      पोलीस भरती नोट्स
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-devanagari leading-relaxed">
                    महाराष्ट्र पोलीस भरती परीक्षेच्या तयारीसाठी संपूर्ण अभ्यास साहित्य
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-xs text-[oklch(0.30_0.005_265)] mb-2 font-devanagari uppercase tracking-wider">
                    विषय श्रेणी
                  </h3>
                  <ul className="space-y-1">
                    {FALLBACK_CATEGORIES.slice(0, 3).map((cat) => (
                      <li
                        key={cat}
                        className="text-xs text-muted-foreground font-devanagari"
                      >
                        {cat}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-xs text-[oklch(0.30_0.005_265)] mb-2 font-devanagari uppercase tracking-wider">
                    आणखी श्रेणी
                  </h3>
                  <ul className="space-y-1">
                    {FALLBACK_CATEGORIES.slice(3).map((cat) => (
                      <li
                        key={cat}
                        className="text-xs text-muted-foreground font-devanagari"
                      >
                        {cat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-2">
                <p className="text-xs text-muted-foreground font-devanagari">
                  &copy; {new Date().getFullYear()} पोलीस भरती नोट्स. सर्व हक्क
                  राखीव.
                </p>
                <p className="text-xs text-muted-foreground">
                  Built with \u2764\uFE0F using{" "}
                  <a
                    href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber hover:underline"
                  >
                    caffeine.ai
                  </a>
                </p>
              </div>
            </div>
          </footer>
        </main>
      </div>

      <Toaster />
    </div>
  );
}
