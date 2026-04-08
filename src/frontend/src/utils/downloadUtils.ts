import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import type { Topic } from "../backend.d";

export async function downloadAsPDF(
  contentElement: HTMLElement,
  topic: Topic,
): Promise<void> {
  // Dynamic import to avoid bundle bloat
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import("jspdf"),
    import("html2canvas"),
  ]);

  const canvas = await html2canvas(contentElement, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - margin * 2;
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = imgHeight / imgWidth;
  const contentHeight = contentWidth * ratio;

  let remainingHeight = contentHeight;
  let yOffset = 0;
  let isFirstPage = true;

  while (remainingHeight > 0) {
    if (!isFirstPage) {
      pdf.addPage();
    }
    isFirstPage = false;

    const pageContentHeight = Math.min(
      remainingHeight,
      pageHeight - margin * 2,
    );
    const srcY = (yOffset / contentHeight) * imgHeight;
    const srcHeight = (pageContentHeight / contentHeight) * imgHeight;

    // Create a temporary canvas for this page slice
    const sliceCanvas = document.createElement("canvas");
    sliceCanvas.width = imgWidth;
    sliceCanvas.height = srcHeight;
    const ctx = sliceCanvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(
        canvas,
        0,
        srcY,
        imgWidth,
        srcHeight,
        0,
        0,
        imgWidth,
        srcHeight,
      );
    }

    const sliceData = sliceCanvas.toDataURL("image/png");
    pdf.addImage(
      sliceData,
      "PNG",
      margin,
      margin,
      contentWidth,
      pageContentHeight,
    );

    yOffset += pageContentHeight;
    remainingHeight -= pageContentHeight;
  }

  pdf.save(`${topic.title}.pdf`);
}

export async function downloadAsDOCX(topic: Topic): Promise<void> {
  const contentLines = topic.content.split("\n");

  const children: Paragraph[] = [
    new Paragraph({
      text: topic.title,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.LEFT,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `\u0936\u094d\u0930\u0947\u0923\u0940: ${topic.category}`,
          bold: true,
          size: 24,
        }),
      ],
      spacing: { after: 200 },
    }),
  ];

  if (topic.subtopics && topic.subtopics.length > 0) {
    children.push(
      new Paragraph({
        text: "\u0909\u092a\u0935\u093f\u0937\u092f:",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      }),
    );
    for (const subtopic of topic.subtopics) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `\u2022 ${subtopic}`,
              size: 24,
            }),
          ],
          spacing: { after: 80 },
        }),
      );
    }
  }

  children.push(
    new Paragraph({
      text: "\u0928\u094b\u091f\u094d\u0938:",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
    }),
  );

  for (const line of contentLines) {
    const trimmed = line.trim();
    if (!trimmed) {
      children.push(new Paragraph({ text: "", spacing: { after: 80 } }));
      continue;
    }

    // Detect numbered list items
    const numberedMatch = trimmed.match(/^(\d+\.\s+)(.*)/);
    // Detect bullet points
    const bulletMatch = trimmed.match(/^[\u2022\-*]\s+(.*)/);

    if (numberedMatch) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: trimmed, size: 24 })],
          spacing: { after: 100 },
          indent: { left: 360 },
        }),
      );
    } else if (bulletMatch) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: trimmed, size: 24 })],
          spacing: { after: 80 },
          indent: { left: 720 },
        }),
      );
    } else {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: trimmed, size: 24 })],
          spacing: { after: 100 },
        }),
      );
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${topic.title}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
