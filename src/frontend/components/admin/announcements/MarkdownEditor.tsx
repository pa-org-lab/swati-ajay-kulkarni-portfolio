"use client";

import type React from "react";
import { useCallback, useRef, useState } from "react";
import {
  FiBold,
  FiCheckSquare,
  FiCode,
  FiColumns,
  FiEdit3,
  FiEye,
  FiHelpCircle,
  FiImage,
  FiItalic,
  FiLink,
  FiList,
  FiMaximize2,
  FiMinimize2,
  FiMinus,
  FiType,
} from "react-icons/fi";
import MarkdownRenderer from "@/frontend/components/common/MarkdownRenderer";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  minHeight?: string;
  placeholder?: string;
}

type EditorViewMode = "write" | "preview" | "split";

const STARTER_TEMPLATES = {
  workshop: `### About This Workshop
Join us for an immersive hands-on session exploring light, composition, and visual storytelling in fine-art photography.

#### Workshop Highlights
- **Understanding Natural Light**: Sculpting portraits with ambient daylight
- **Composition & Framing**: Editorial techniques and visual flow
- **Live Practical Shoot**: Direct guidance with live models
- **Image Critique**: Individual reviews of participants' portfolios

#### Schedule & Details
| Session | Topic | Duration |
|---|---|---|
| Part 1 | Theory, Camera Setup & Light Meters | 10:00 AM - 12:30 PM |
| Lunch Break | Networking & Q&A | 12:30 PM - 01:30 PM |
| Part 2 | Live Practice Shoot & Portfolio Review | 01:30 PM - 04:30 PM |

> "Light is the voice of photography; learn to listen before pressing the shutter."

#### Prerequisites & What to Bring
- Any DSLR or Mirrorless camera with a 35mm, 50mm, or 85mm prime lens
- Fully charged batteries and formatted memory cards
- A notebook or sketchbook

**Limited Seats Available** — Please reserve your spot early.
`,
  exhibition: `### Exhibition Overview
We are delighted to present **"Transient Shadows & Earth Tones"**, a solo retrospective exploring monochrome street perspectives and tactile landscapes.

#### Curatorial Note
This body of work documents the subtle geometry of urban sanctuaries and changing light across metropolitan spaces. Each print is handcrafted on archival cotton rag paper.

#### Exhibition Schedule
- **Opening Reception**: Friday evening with artist walkthrough
- **Gallery Hours**: Tuesday – Sunday, 11:00 AM – 7:00 PM (Mondays Closed)
- **Special Artist Talk**: Saturday at 4:00 PM — *Reflections on Thirty Years with Film*

#### Location & Access
- **Venue**: Main Gallery Hall, Cultural Arts Center
- **Admission**: Complimentary and open to the public
- **Catalog**: Limited edition exhibition monographs available at the front desk

For private viewings or inquiries, please visit our contact desk.
`,
  community: `### Community Photowalk & Print Exchange
Calling all visual artists, hobbyists, and fellow photographers! Let us gather for an inspiring morning photowalk followed by an informal print critique over coffee.

#### Itinerary
1. **07:00 AM**: Meet at the Heritage Clock Tower
2. **07:30 AM – 09:30 AM**: Guided walk through the historic markets & architectural alleys
3. **10:00 AM**: Coffee & Print Swap at Cafe Botanica

#### What to Bring
- - [x] Your camera of choice (Digital, Film, or Mobile)
- - [ ] Comfortable walking shoes & hydration
- - [ ] 1 to 3 printed 4x6 or 5x7 prints to share in our exchange

> Everyone is welcome regardless of skill level or equipment!

RSVP below to receive the meeting point coordinates and group chat invite.
`,
};

export default function MarkdownEditor({
  value,
  onChange,
  minHeight = "360px",
  placeholder = "Write your announcement content here using Markdown...",
}: MarkdownEditorProps) {
  const [viewMode, setViewMode] = useState<EditorViewMode>("split");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCheatsheet, setShowCheatsheet] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper to insert markdown formatting at current cursor selection
  const insertFormatting = useCallback(
    (prefix: string, suffix = "", defaultText = "text") => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = value.substring(start, end) || defaultText;

      const before = value.substring(0, start);
      const after = value.substring(end);

      const replacement = `${prefix}${selected}${suffix}`;
      const nextValue = `${before}${replacement}${after}`;
      onChange(nextValue);

      // Reposition cursor
      requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + prefix.length,
          start + prefix.length + selected.length,
        );
      });
    },
    [value, onChange],
  );

  // Helper to insert a block element (headings, lists, blockquotes)
  const insertBlock = useCallback(
    (prefix: string, defaultText = "Text") => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = value.substring(start, end);

      const before = value.substring(0, start);
      const after = value.substring(end);

      // Check if we need a preceding newline
      const needsLeadingNewline = start > 0 && !before.endsWith("\n");
      const newlinePrefix = needsLeadingNewline ? "\n" : "";

      const replacement = `${newlinePrefix}${prefix}${selected || defaultText}\n`;
      const nextValue = `${before}${replacement}${after}`;
      onChange(nextValue);

      requestAnimationFrame(() => {
        textarea.focus();
        const cursorPosition =
          start +
          newlinePrefix.length +
          prefix.length +
          (selected ? selected.length : defaultText.length);
        textarea.setSelectionRange(cursorPosition, cursorPosition);
      });
    },
    [value, onChange],
  );

  // Helper to insert a table
  const insertTable = () => {
    const tableTemplate = `\n| Item | Description | Date / Time |\n|---|---|---|\n| Session 1 | Overview & Introductions | 10:00 AM |\n| Session 2 | Live Practice & Discussion | 02:00 PM |\n`;
    insertFormatting(tableTemplate, "", "");
  };

  // Helper to insert link
  const handleInsertLink = () => {
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart || 0;
    const end = textarea?.selectionEnd || 0;
    const selected = value.substring(start, end) || "link title";

    const url = window.prompt(
      "Enter the URL destination (e.g. https://...):",
      "https://",
    );
    if (!url) return;

    const markdownLink = `[${selected}](${url.trim()})`;
    const before = value.substring(0, start);
    const after = value.substring(end);
    onChange(`${before}${markdownLink}${after}`);
  };

  // Helper to insert image
  const handleInsertImage = () => {
    const url = window.prompt("Enter image URL:", "https://");
    if (!url) return;
    const alt = window.prompt("Enter image description / alt text:", "Photo");
    insertFormatting(`\n![${alt || "Photo"}](${url.trim()})\n`, "", "");
  };

  // Handle Tab key inside textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      insertFormatting("  ", "", "");
    } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
      e.preventDefault();
      insertFormatting("**", "**", "bold text");
    } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "i") {
      e.preventDefault();
      insertFormatting("*", "*", "italic text");
    } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      handleInsertLink();
    }
  };

  // Calculate metrics
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 180));

  return (
    <div
      className={`flex flex-col rounded-2xl border border-stone-300 bg-white shadow-2xs transition-all duration-300 ${
        isFullscreen
          ? "fixed inset-4 z-50 shadow-2xl flex-col bg-white"
          : "relative w-full"
      }`}
    >
      {/* 1. TOP TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/90 bg-[#FAF7F5] px-3.5 py-2.5 rounded-t-2xl">
        {/* Left: Formatting tools */}
        <div className="flex flex-wrap items-center gap-1 text-stone-700">
          {/* Headings */}
          <div className="flex items-center bg-white border border-stone-200 rounded-lg p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => insertBlock("# ", "Heading 1")}
              title="Heading 1 (# )"
              className="px-2 py-1 text-xs font-semibold hover:bg-stone-100 rounded text-stone-800 transition-colors"
            >
              H1
            </button>
            <button
              type="button"
              onClick={() => insertBlock("## ", "Heading 2")}
              title="Heading 2 (## )"
              className="px-2 py-1 text-xs font-semibold hover:bg-stone-100 rounded text-stone-800 transition-colors"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => insertBlock("### ", "Heading 3")}
              title="Heading 3 (### )"
              className="px-2 py-1 text-xs font-semibold hover:bg-stone-100 rounded text-stone-800 transition-colors"
            >
              H3
            </button>
          </div>

          <div className="h-4 w-[1px] bg-stone-300 mx-1" />

          {/* Inline Styles */}
          <button
            type="button"
            onClick={() => insertFormatting("**", "**", "bold text")}
            title="Bold (Cmd/Ctrl + B)"
            className="p-1.5 hover:bg-stone-200/80 rounded-lg text-stone-700 hover:text-stone-950 transition-colors"
          >
            <FiBold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("*", "*", "italic text")}
            title="Italic (Cmd/Ctrl + I)"
            className="p-1.5 hover:bg-stone-200/80 rounded-lg text-stone-700 hover:text-stone-950 transition-colors"
          >
            <FiItalic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("~~", "~~", "strikethrough text")}
            title="Strikethrough"
            className="p-1.5 hover:bg-stone-200/80 rounded-lg text-stone-700 hover:text-stone-950 transition-colors"
          >
            <FiType className="w-4 h-4" />
          </button>

          <div className="h-4 w-[1px] bg-stone-300 mx-1" />

          {/* Lists & Quotes */}
          <button
            type="button"
            onClick={() => insertBlock("- ", "List item")}
            title="Bullet List"
            className="p-1.5 hover:bg-stone-200/80 rounded-lg text-stone-700 hover:text-stone-950 transition-colors"
          >
            <FiList className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertBlock("1. ", "List item")}
            title="Numbered List"
            className="p-1.5 hover:bg-stone-200/80 rounded-lg text-stone-700 hover:text-stone-950 transition-colors text-xs font-mono font-bold"
          >
            1.
          </button>
          <button
            type="button"
            onClick={() => insertBlock("- [ ] ", "Checklist task")}
            title="Task List / Checkbox"
            className="p-1.5 hover:bg-stone-200/80 rounded-lg text-stone-700 hover:text-stone-950 transition-colors"
          >
            <FiCheckSquare className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertBlock("> ", "Quote text")}
            title="Blockquote"
            className="p-1.5 hover:bg-stone-200/80 rounded-lg text-stone-700 hover:text-stone-950 transition-colors text-xs font-serif italic font-bold"
          >
            &ldquo;&rdquo;
          </button>

          <div className="h-4 w-[1px] bg-stone-300 mx-1" />

          {/* Links, Images, Tables, Code */}
          <button
            type="button"
            onClick={handleInsertLink}
            title="Insert Link (Cmd/Ctrl + K)"
            className="p-1.5 hover:bg-stone-200/80 rounded-lg text-stone-700 hover:text-stone-950 transition-colors"
          >
            <FiLink className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleInsertImage}
            title="Insert Image"
            className="p-1.5 hover:bg-stone-200/80 rounded-lg text-stone-700 hover:text-stone-950 transition-colors"
          >
            <FiImage className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={insertTable}
            title="Insert Table"
            className="p-1.5 hover:bg-stone-200/80 rounded-lg text-stone-700 hover:text-stone-950 transition-colors text-xs font-mono font-bold"
          >
            ⊞
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("`", "`", "code")}
            title="Inline Code"
            className="p-1.5 hover:bg-stone-200/80 rounded-lg text-stone-700 hover:text-stone-950 transition-colors"
          >
            <FiCode className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting("\n---\n", "", "")}
            title="Divider Line"
            className="p-1.5 hover:bg-stone-200/80 rounded-lg text-stone-700 hover:text-stone-950 transition-colors"
          >
            <FiMinus className="w-4 h-4" />
          </button>

          {/* Templates Dropdown Button */}
          <div className="relative ml-1">
            <button
              type="button"
              onClick={() => setShowTemplates(!showTemplates)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[#BE6030] bg-[#BE6030]/10 hover:bg-[#BE6030]/20 rounded-lg border border-[#BE6030]/30 transition-colors"
            >
              <span>+ Insert Template</span>
            </button>

            {showTemplates && (
              <div className="absolute left-0 top-full mt-1.5 w-60 bg-white border border-stone-200 rounded-xl shadow-lg p-1.5 z-30 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    onChange(
                      value
                        ? `${value}\n\n${STARTER_TEMPLATES.workshop}`
                        : STARTER_TEMPLATES.workshop,
                    );
                    setShowTemplates(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-stone-800 hover:bg-stone-100 flex items-center gap-2"
                >
                  <span>🎓 Classes & Workshop</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChange(
                      value
                        ? `${value}\n\n${STARTER_TEMPLATES.exhibition}`
                        : STARTER_TEMPLATES.exhibition,
                    );
                    setShowTemplates(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-stone-800 hover:bg-stone-100 flex items-center gap-2"
                >
                  <span>🎨 Gallery Exhibition</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChange(
                      value
                        ? `${value}\n\n${STARTER_TEMPLATES.community}`
                        : STARTER_TEMPLATES.community,
                    );
                    setShowTemplates(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-stone-800 hover:bg-stone-100 flex items-center gap-2"
                >
                  <span>🤝 Community Photowalk</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: View Mode Toggle & Fullscreen */}
        <div className="flex items-center gap-2">
          {/* Mode Tabs */}
          <div className="inline-flex items-center bg-stone-200/80 p-0.5 rounded-xl text-xs font-medium text-stone-600">
            <button
              type="button"
              onClick={() => setViewMode("write")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
                viewMode === "write"
                  ? "bg-white text-stone-900 shadow-2xs font-semibold"
                  : "hover:text-stone-900"
              }`}
            >
              <FiEdit3 className="w-3.5 h-3.5" />
              <span>Write</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
                viewMode === "preview"
                  ? "bg-white text-stone-900 shadow-2xs font-semibold"
                  : "hover:text-stone-900"
              }`}
            >
              <FiEye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("split")}
              className={`hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
                viewMode === "split"
                  ? "bg-white text-stone-900 shadow-2xs font-semibold"
                  : "hover:text-stone-900"
              }`}
            >
              <FiColumns className="w-3.5 h-3.5" />
              <span>Split</span>
            </button>
          </div>

          {/* Cheatsheet info button */}
          <button
            type="button"
            onClick={() => setShowCheatsheet(!showCheatsheet)}
            title="Markdown syntax reference"
            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition-colors"
          >
            <FiHelpCircle className="w-4 h-4" />
          </button>

          {/* Fullscreen toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen editor"}
            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition-colors"
          >
            {isFullscreen ? (
              <FiMinimize2 className="w-4 h-4" />
            ) : (
              <FiMaximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Cheatsheet Guide Drawer */}
      {showCheatsheet && (
        <div className="bg-[#2b1f18] text-stone-200 px-4 py-3 text-xs flex flex-wrap items-center justify-between gap-3 border-b border-stone-800">
          <div className="flex flex-wrap items-center gap-4">
            <span>
              <code className="text-[#c2654d]"># H1</code>,{" "}
              <code className="text-[#c2654d]">## H2</code>
            </span>
            <span>
              <code className="text-[#c2654d]">**bold**</code>
            </span>
            <span>
              <code className="text-[#c2654d]">*italic*</code>
            </span>
            <span>
              <code className="text-[#c2654d]">[title](https://...)</code>
            </span>
            <span>
              <code className="text-[#c2654d]">&gt; quote</code>
            </span>
            <span>
              <code className="text-[#c2654d]">- list item</code>
            </span>
            <span>
              <code className="text-[#c2654d]">- [x] task</code>
            </span>
            <span>
              <code className="text-[#c2654d]">| Table | Col |</code>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowCheatsheet(false)}
            className="text-stone-400 hover:text-white underline text-[11px]"
          >
            Close
          </button>
        </div>
      )}

      {/* 2. MAIN WORKSPACE AREA */}
      <div
        className={`flex-1 grid ${
          viewMode === "split"
            ? "grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-200"
            : "grid-cols-1"
        }`}
        style={{ minHeight: isFullscreen ? "calc(100vh - 120px)" : minHeight }}
      >
        {/* Write View (Textarea) */}
        {(viewMode === "write" || viewMode === "split") && (
          <div className="flex flex-col h-full bg-white relative">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              aria-label="Markdown announcement editor"
              className="w-full flex-1 p-4 font-mono text-[13.5px] text-stone-800 bg-transparent resize-y outline-none leading-relaxed placeholder:text-stone-400 focus:ring-0"
              style={{ minHeight: isFullscreen ? "100%" : minHeight }}
            />
          </div>
        )}

        {/* Preview View (Rendered Output) */}
        {(viewMode === "preview" || viewMode === "split") && (
          <div className="flex flex-col h-full bg-[#FCFAF8] overflow-y-auto p-5 sm:p-6">
            <div className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-stone-400 mb-3 border-b border-stone-200/60 pb-1.5 flex items-center justify-between">
              <span>Live Markdown Preview</span>
              <span className="text-stone-400 font-normal">
                {wordCount} words
              </span>
            </div>
            {value.trim() ? (
              <MarkdownRenderer content={value} />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-stone-400 text-center">
                <FiEdit3 className="w-8 h-8 mb-2 opacity-40 text-[#BE6030]" />
                <p className="text-sm font-sans">
                  Start writing on the left to see your formatted content
                  preview here in real-time.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. BOTTOM STATUS BAR */}
      <div className="flex items-center justify-between px-4 py-2 bg-stone-100/80 border-t border-stone-200/80 rounded-b-2xl text-[11px] text-stone-500 font-sans">
        <div className="flex items-center gap-3">
          <span>{charCount} characters</span>
          <span>·</span>
          <span>{wordCount} words</span>
          <span>·</span>
          <span>~{readTimeMinutes} min read</span>
        </div>
        <div className="flex items-center gap-2 text-stone-400 text-[10.5px]">
          <span className="hidden sm:inline">Markdown GFM supported</span>
          <span className="hidden sm:inline">·</span>
          <span>Sanitized HTML</span>
        </div>
      </div>
    </div>
  );
}
