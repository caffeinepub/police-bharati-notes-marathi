import { BookOpen, ChevronRight, Download, Shield } from "lucide-react";
import { motion } from "motion/react";
import { FALLBACK_CATEGORIES } from "../data/fallbackData";

export default function WelcomeScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-16 px-6"
      data-ocid="welcome.section"
    >
      {/* Badge */}
      <div className="w-20 h-20 rounded-2xl bg-amber flex items-center justify-center shadow-lg mb-6">
        <Shield className="w-10 h-10 text-[oklch(0.12_0.005_265)]" />
      </div>

      <h1 className="text-3xl font-bold text-[oklch(0.12_0.005_265)] mb-3 font-devanagari text-center">
        पोलीस भरती नोट्स
      </h1>

      <p className="text-muted-foreground text-center max-w-lg font-devanagari text-base leading-relaxed mb-8">
        महाराष्ट्र पोलीस भरती परीक्षेच्या तयारीसाठी सर्वसमावेशक नोट्स. विषयनिहाय अभ्यास
        साहित्य PDF आणि Word फाईल म्हणून डाउनलोड करा.
      </p>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mb-10">
        <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-amber/15 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-[oklch(0.55_0.14_60)]" />
          </div>
          <h3 className="font-semibold text-sm text-[oklch(0.18_0.005_265)] font-devanagari">
            विषयनिहाय नोट्स
          </h3>
          <p className="text-xs text-muted-foreground font-devanagari leading-relaxed">
            सर्व महत्त्वाच्या विषयांचे सविस्तर नोट्स
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-amber/15 flex items-center justify-center">
            <Download className="w-5 h-5 text-[oklch(0.55_0.14_60)]" />
          </div>
          <h3 className="font-semibold text-sm text-[oklch(0.18_0.005_265)] font-devanagari">
            PDF / Word डाउनलोड
          </h3>
          <p className="text-xs text-muted-foreground font-devanagari leading-relaxed">
            नोट्स PDF आणि DOCX फाईलमध्ये सेव्ह करा
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-amber/15 flex items-center justify-center">
            <Shield className="w-5 h-5 text-[oklch(0.55_0.14_60)]" />
          </div>
          <h3 className="font-semibold text-sm text-[oklch(0.18_0.005_265)] font-devanagari">
            मराठी भाषेत
          </h3>
          <p className="text-xs text-muted-foreground font-devanagari leading-relaxed">
            संपूर्ण मराठी भाषेत तयार केलेले नोट्स
          </p>
        </div>
      </div>

      {/* Categories list */}
      <div className="w-full max-w-2xl">
        <h2 className="text-sm font-semibold text-muted-foreground font-devanagari mb-3">
          उपलब्ध विषय श्रेणी:
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {FALLBACK_CATEGORIES.map((cat) => (
            <div
              key={cat}
              className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-lg text-sm font-devanagari text-[oklch(0.30_0.005_265)] hover:border-amber/40 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-amber flex-shrink-0" />
              {cat}
            </div>
          ))}
        </div>
      </div>

      <p className="mt-8 text-xs text-muted-foreground font-devanagari text-center">
        डाव्या बाजूला असलेल्या मेनूमधून विषय निवडा
      </p>
    </motion.div>
  );
}
