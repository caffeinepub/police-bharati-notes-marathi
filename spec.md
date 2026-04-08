# Police Bharati Notes Generator (Marathi)

## Current State
New project. No existing files.

## Requested Changes (Diff)

### Add
- A Marathi-language notes generator app for Police Bharati competitive exam
- Topic-wise notes covering all major Police Bharati exam subjects
- Ability to generate structured notes for each topic in Marathi
- Download notes as PDF format
- Download notes as Word (.docx) format
- Topic list covering: Maharashtra Geography, Indian History, Indian Constitution, General Science, Current Affairs, Mathematics, Marathi Grammar, Police Acts & Rules, etc.
- Notes display panel showing formatted content
- Topic selector (category/subject wise)
- Notes content stored in backend per topic

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Backend: Store topic-wise notes content in Marathi. Topics organized by subject categories. CRUD for notes.
2. Frontend: Topic sidebar with subject categories, notes viewer panel, Download PDF button (using jsPDF), Download Word button (using docx.js or html-docx-js)
3. Notes content pre-seeded with Police Bharati exam topics in Marathi
4. PDF generation using jsPDF with Marathi Unicode support
5. Word/DOCX generation using docx library
