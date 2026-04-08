import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronRight, Loader2, Shield } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Topic } from "../backend.d";
import {
  useGetAllCategories,
  useGetTopicsByCategory,
} from "../hooks/useQueries";

interface SidebarProps {
  selectedTopic: Topic | null;
  onTopicSelect: (topic: Topic) => void;
  defaultExpandedCategory?: string | null;
}

interface CategoryItemProps {
  category: string;
  isExpanded: boolean;
  onToggle: () => void;
  selectedTopic: Topic | null;
  onTopicSelect: (topic: Topic) => void;
}

function CategoryItem({
  category,
  isExpanded,
  onToggle,
  selectedTopic,
  onTopicSelect,
}: CategoryItemProps) {
  const { data: topics = [], isLoading } = useGetTopicsByCategory(
    isExpanded ? category : "",
  );

  return (
    <div className="mb-1">
      <button
        type="button"
        onClick={onToggle}
        data-ocid="sidebar.category.tab"
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-150 group ${
          isExpanded
            ? "bg-[oklch(0.26_0.014_258)] text-white"
            : "text-[oklch(0.75_0.01_265)] hover:bg-[oklch(0.24_0.012_258)] hover:text-white"
        }`}
      >
        <span className="flex-1 text-left text-sm font-medium font-devanagari tracking-wide">
          {category}
        </span>
        <span
          className={`transition-transform duration-200 ${
            isExpanded ? "text-amber" : "text-[oklch(0.55_0.01_265)]"
          }`}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pl-3 py-1 space-y-0.5">
              {isLoading ? (
                <div className="flex items-center gap-2 px-3 py-2 text-[oklch(0.55_0.01_265)]">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span className="text-xs">
                    \u0932\u094b\u0821 \u0939\u094b\u0924 \u0906\u0939\u0947...
                  </span>
                </div>
              ) : topics.length === 0 ? (
                <div className="px-3 py-2 text-xs text-[oklch(0.5_0.01_265)]">
                  \u0915\u094b\u0923\u0924\u093e\u0939\u0940
                  \u0935\u093f\u0937\u092f \u0928\u093e\u0939\u0940
                </div>
              ) : (
                topics.map((topic, tIndex) => {
                  const isActive = selectedTopic?.id === topic.id;
                  return (
                    <button
                      type="button"
                      key={topic.id.toString()}
                      onClick={() => onTopicSelect(topic)}
                      data-ocid={`sidebar.topic.item.${tIndex + 1}`}
                      className={`active-topic-accent w-full flex items-center text-left px-3 py-2 rounded-md text-sm transition-all duration-150 ${
                        isActive
                          ? "bg-[oklch(0.28_0.014_258)] text-amber font-medium"
                          : "text-[oklch(0.68_0.01_265)] hover:bg-[oklch(0.24_0.012_258)] hover:text-white"
                      }`}
                    >
                      <span className="font-devanagari line-clamp-2 leading-snug">
                        {topic.title}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Sidebar({
  selectedTopic,
  onTopicSelect,
  defaultExpandedCategory,
}: SidebarProps) {
  const { data: categories = [], isLoading } = useGetAllCategories();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(defaultExpandedCategory ? [defaultExpandedCategory] : []),
  );

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  return (
    <aside className="sidebar-gradient flex flex-col h-full w-full">
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[oklch(0.28_0.010_255)]">
        <div className="w-9 h-9 rounded-lg bg-amber flex items-center justify-center flex-shrink-0 shadow-md">
          <Shield className="w-5 h-5 text-[oklch(0.12_0.005_265)]" />
        </div>
        <div>
          <h1 className="text-white font-bold text-base leading-tight font-devanagari">
            \u092a\u094b\u0932\u0940\u0938 \u092d\u0930\u0924\u0940
          </h1>
          <p className="text-[oklch(0.55_0.01_265)] text-xs">
            \u0928\u094b\u091f\u094d\u0938
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full sidebar-scroll">
          <nav
            className="px-3 py-4"
            aria-label="\u0935\u093f\u0937\u092f \u0938\u0942\u091a\u0940"
          >
            <p className="px-2 mb-3 text-xs font-semibold text-[oklch(0.45_0.01_265)] uppercase tracking-wider">
              \u0935\u093f\u0937\u092f \u0936\u094d\u0930\u0947\u0923\u0940
            </p>

            {isLoading ? (
              <div className="flex items-center gap-2 px-4 py-3 text-[oklch(0.55_0.01_265)]">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm font-devanagari">
                  \u0932\u094b\u0821 \u0939\u094b\u0924 \u0906\u0939\u0947...
                </span>
              </div>
            ) : (
              categories.map((category) => (
                <CategoryItem
                  key={category}
                  category={category}
                  isExpanded={expandedCategories.has(category)}
                  onToggle={() => toggleCategory(category)}
                  selectedTopic={selectedTopic}
                  onTopicSelect={onTopicSelect}
                />
              ))
            )}
          </nav>
        </ScrollArea>
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-[oklch(0.28_0.010_255)]">
        <p className="text-xs text-[oklch(0.4_0.01_265)] text-center">
          \u092a\u094b\u0932\u0940\u0938 \u092d\u0930\u0924\u0940
          \u092a\u0930\u0940\u0915\u094d\u0937\u093e
          \u0924\u092f\u093e\u0930\u0940
        </p>
      </div>
    </aside>
  );
}
