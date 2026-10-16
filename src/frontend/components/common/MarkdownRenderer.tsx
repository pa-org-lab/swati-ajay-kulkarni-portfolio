"use client";

import ReactMarkdown from "react-markdown";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Ensure table elements and attributes are permitted during sanitization
const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code || []), "className"],
    th: [...(defaultSchema.attributes?.th || []), "align", "style"],
    td: [...(defaultSchema.attributes?.td || []), "align", "style"],
    input: [
      ...(defaultSchema.attributes?.input || []),
      "type",
      "checked",
      "disabled",
    ],
  },
};

export default function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  if (!content) {
    return null;
  }

  return (
    <div
      className={`markdown-body text-stone-800 leading-relaxed font-sans text-[14.5px] sm:text-[15px] ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeSanitize, sanitizeSchema]]}
        components={{
          h1: ({ children }) => (
            <h1 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal mt-6 mb-3 pb-2 border-b border-stone-200/80 tracking-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal mt-5 mb-2.5 tracking-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-serif text-lg sm:text-xl text-stone-900 font-medium mt-4 mb-2">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="font-sans text-xs text-stone-900 font-semibold mt-3 mb-1.5 uppercase tracking-wider">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="my-3 font-light text-stone-700 leading-relaxed">
              {children}
            </p>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-[#BE6030] hover:text-[#2b1f18] underline underline-offset-4 decoration-[#BE6030]/50 hover:decoration-[#2b1f18] font-medium transition-colors"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="my-3 pl-5 list-disc space-y-1.5 text-stone-700 marker:text-[#BE6030]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-3 pl-5 list-decimal space-y-1.5 text-stone-700 marker:text-[#BE6030] marker:font-semibold">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="pl-1">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-4 border-[#BE6030] bg-stone-100/70 py-2.5 px-4 rounded-r-xl italic text-stone-700">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto rounded-xl border border-stone-200 shadow-2xs">
              <table className="w-full text-left text-sm text-stone-800 border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-stone-100/90 text-stone-900 uppercase text-[11px] tracking-wider font-semibold border-b border-stone-200">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-stone-200/60 bg-white">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-stone-50/70 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 font-semibold text-stone-900">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-stone-700">{children}</td>
          ),
          code: ({ className, children }) => {
            const isBlock = className?.includes("language-");
            if (isBlock) {
              return (
                <code className="block bg-[#2b1f18] text-stone-100 p-4 rounded-xl font-mono text-[13px] overflow-x-auto my-3 leading-relaxed">
                  {children}
                </code>
              );
            }
            return (
              <code className="bg-stone-100 text-[#a8522e] px-1.5 py-0.5 rounded text-[13px] font-mono border border-stone-200/60">
                {children}
              </code>
            );
          },
          hr: () => <hr className="my-6 border-stone-200/80" />,
          img: ({ src, alt }) => (
            <span className="block my-4">
              {/* biome-ignore lint/performance/noImgElement: dynamic user-authored markdown content images */}
              <img
                src={src}
                alt={alt || "Announcement image"}
                className="rounded-2xl max-h-[460px] w-auto mx-auto object-cover shadow-sm border border-stone-200"
                loading="lazy"
              />
              {alt && (
                <span className="block text-center text-xs text-stone-400 mt-2 italic">
                  {alt}
                </span>
              )}
            </span>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
