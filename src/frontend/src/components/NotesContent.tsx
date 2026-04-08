import { Separator } from "@/components/ui/separator";
import { Download, FileDown, FileText, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { Topic } from "../backend.d";
import { downloadAsDOCX, downloadAsPDF } from "../utils/downloadUtils";

interface NotesContentProps {
  topic: Topic;
}

function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  let listIndex = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ol
          key={`list-${listIndex++}`}
          className="list-none pl-0 space-y-1 my-3"
        >
          {listItems}
        </ol>,
      );
      listItems = [];
    }
  };

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    const lineKey = `line-${i}-${trimmed.slice(0, 8)}`;

    if (!trimmed) {
      flushList();
      elements.push(<div key={`empty-${lineKey}`} className="h-2" />);
      return;
    }

    // Section heading detection (text ending with colon that's not a bullet)
    const isSectionHeading =
      trimmed.endsWith(":") &&
      !trimmed.startsWith("\u2022") &&
      !trimmed.startsWith("-") &&
      !trimmed.match(/^\d+\./) &&
      trimmed.length < 60;

    // Numbered item: 1. text or \u0967. text
    const numberedMatch = trimmed.match(
      /^(\d+|[\u0967\u0968\u0969\u096a\u096b\u096c\u096d\u096e\u096f]+)[.\u0964]\s+(.+)/,
    );
    // Bullet: \u2022 or - or *
    const bulletMatch = trimmed.match(/^[\u2022\-*]\s+(.+)/);

    if (isSectionHeading && i > 0) {
      flushList();
      elements.push(
        <h3
          key={`heading-${lineKey}`}
          className="font-bold text-base mt-5 mb-2 text-[oklch(0.12_0.005_265)] font-devanagari"
        >
          {trimmed}
        </h3>,
      );
    } else if (numberedMatch) {
      flushList();
      elements.push(
        <div
          key={`numbered-${lineKey}`}
          className="flex gap-3 py-1 text-[oklch(0.18_0.005_265)] font-devanagari text-sm leading-relaxed"
        >
          <span className="text-amber font-bold flex-shrink-0 w-6">
            {numberedMatch[1]}.
          </span>
          <span>{numberedMatch[2]}</span>
        </div>,
      );
    } else if (bulletMatch) {
      elements.push(
        <div
          key={`bullet-${lineKey}`}
          className="flex gap-2 py-0.5 pl-4 text-[oklch(0.22_0.005_265)] font-devanagari text-sm leading-relaxed"
        >
          <span className="text-amber flex-shrink-0 mt-0.5">\u2022</span>
          <span>{bulletMatch[1]}</span>
        </div>,
      );
    } else if (i === 0) {
      // First line = main title
      elements.push(
        <h2
          key={`title-${lineKey}`}
          className="text-xl font-bold text-[oklch(0.12_0.005_265)] mb-3 font-devanagari leading-snug"
        >
          {trimmed}
        </h2>,
      );
    } else {
      flushList();
      elements.push(
        <p
          key={`para-${lineKey}`}
          className="text-[oklch(0.22_0.005_265)] font-devanagari text-sm leading-relaxed"
        >
          {trimmed}
        </p>,
      );
    }
  });

  flushList();
  return elements;
}

export default function NotesContent({ topic }: NotesContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [docxLoading, setDocxLoading] = useState(false);

  const handlePdfDownload = async () => {
    if (!contentRef.current) return;
    setPdfLoading(true);
    try {
      await downloadAsPDF(contentRef.current, topic);
      toast.success(
        "PDF \u092f\u0936\u0938\u094d\u0935\u0940\u0930\u093f\u0924\u094d\u092f\u093e \u0921\u093e\u0909\u0928\u0932\u094b\u0921 \u091d\u093e\u0932\u0947!",
      );
    } catch (err) {
      console.error(err);
      toast.error(
        "PDF \u0921\u093e\u0909\u0928\u0932\u094b\u0921 \u0915\u0930\u0924\u093e\u0928\u093e \u0924\u094d\u0930\u0941\u091f\u0940 \u0906\u0932\u0940.",
      );
    } finally {
      setPdfLoading(false);
    }
  };

  const handleDocxDownload = async () => {
    setDocxLoading(true);
    try {
      await downloadAsDOCX(topic);
      toast.success(
        "DOCX \u092f\u0936\u0938\u094d\u0935\u0940\u0930\u093f\u0924\u094d\u092f\u093e \u0821\u093e\u0909\u0928\u0932\u094b\u0921 \u091d\u093e\u0932\u0947!",
      );
    } catch (err) {
      console.error(err);
      toast.error(
        "DOCX \u0821\u093e\u0909\u0928\u0932\u094b\u0921 \u0915\u0930\u0924\u093e\u0928\u093e \u0924\u094d\u0930\u0941\u091f\u0940 \u0906\u0932\u0940.",
      );
    } finally {
      setDocxLoading(false);
    }
  };

  return (
    <motion.div
      key={topic.id.toString()}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="bg-card rounded-xl shadow-card overflow-hidden"
      data-ocid="notes.card"
    >
      {/* Card Header */}
      <div className="px-6 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {/* Title area */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber/15 text-[oklch(0.50_0.14_60)] border border-amber/25 font-devanagari">
                {topic.category}
              </span>
            </div>
            <h2 className="text-xl font-bold text-[oklch(0.12_0.005_265)] font-devanagari leading-snug">
              {topic.title}
            </h2>
          </div>

          {/* Download actions */}
          <div className="flex flex-col sm:items-end gap-2 flex-shrink-0">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 font-devanagari">
              <Download className="w-3.5 h-3.5" />
              \u0821\u093e\u0909\u0928\u0932\u094b\u0821 \u0915\u0930\u093e:
            </span>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={handlePdfDownload}
                disabled={pdfLoading}
                data-ocid="notes.pdf.button"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-amber text-[oklch(0.12_0.005_265)] hover:bg-amber-dark transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed shadow-xs font-devanagari"
              >
                {pdfLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
                PDF \u0821\u093e\u0909\u0928\u0932\u094b\u0821
              </button>

              <button
                type="button"
                onClick={handleDocxDownload}
                disabled={docxLoading}
                data-ocid="notes.docx.button"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-amber text-[oklch(0.12_0.005_265)] hover:bg-amber-dark transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed shadow-xs font-devanagari"
              >
                {docxLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FileDown className="w-4 h-4" />
                )}
                DOCX \u0821\u093e\u0909\u0928\u0932\u094b\u0821
              </button>
            </div>
          </div>
        </div>

        {/* Subtopics pills */}
        {topic.subtopics && topic.subtopics.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground mr-1 font-devanagari">
              \u0909\u092a\u0935\u093f\u0937\u092f:
            </span>
            {topic.subtopics.map((sub) => (
              <span
                key={sub}
                className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs bg-muted text-muted-foreground border border-border font-devanagari"
              >
                {sub}
              </span>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Notes content (captured for PDF) */}
      <div
        ref={contentRef}
        className="px-6 py-5 notes-content pdf-capture-area"
        data-ocid="notes.content.panel"
      >
        <div className="mb-4 pb-3 border-b border-[oklch(0.92_0.005_265)]">
          <h1 className="text-lg font-bold text-[oklch(0.12_0.005_265)] font-devanagari mb-1">
            {topic.title}
          </h1>
          <p className="text-xs text-[oklch(0.50_0.01_265)] font-devanagari">
            \u0936\u094d\u0930\u0947\u0923\u0940: {topic.category}
          </p>
        </div>
        {renderContent(topic.content)}
      </div>
    </motion.div>
  );
}
