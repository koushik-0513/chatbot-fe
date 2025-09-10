import ReactMarkdown from "react-markdown";

import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer = ({
  content,
  className = "",
}: MarkdownRendererProps) => {
  // Check if custom classes are provided for small text
  const isSmallText =
    className.includes("prose-p:text-xs") || className.includes("text-xs");

  return (
    <div className={`prose prose-lg text-foreground max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom styling for markdown elements
          h1: ({ children }) => (
            <h1
              className={
                isSmallText
                  ? "text-card-foreground mb-1 text-xs font-normal"
                  : "text-card-foreground mb-4 text-2xl font-bold"
              }
            >
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2
              className={
                isSmallText
                  ? "text-card-foreground mb-1 text-xs font-normal"
                  : "text-card-foreground mb-3 text-xl font-semibold"
              }
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3
              className={
                isSmallText
                  ? "text-card-foreground mb-1 text-xs font-normal"
                  : "text-card-foreground mb-2 text-lg font-semibold"
              }
            >
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p
              className={
                isSmallText
                  ? "text-muted-foreground mb-0.5 text-xs leading-relaxed"
                  : "text-foreground mb-4 leading-relaxed"
              }
            >
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul
              className={
                isSmallText
                  ? "text-muted-foreground mb-1 ml-4 list-disc text-xs"
                  : "text-foreground mb-4 ml-6 list-disc"
              }
            >
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol
              className={
                isSmallText
                  ? "text-muted-foreground mb-1 ml-4 list-decimal text-xs"
                  : "text-foreground mb-4 ml-6 list-decimal"
              }
            >
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li
              className={
                isSmallText
                  ? "text-muted-foreground mb-0.5 text-xs"
                  : "text-foreground mb-1"
              }
            >
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote
              className={
                isSmallText
                  ? "border-primary text-muted-foreground mb-1 border-l-2 pl-2 text-xs italic"
                  : "border-primary text-muted-foreground mb-4 border-l-4 pl-4 italic"
              }
            >
              {children}
            </blockquote>
          ),
          code: ({ children, className: codeClassName }) => {
            const isInline = !codeClassName;
            return isInline ? (
              <code
                className={
                  isSmallText
                    ? "bg-muted text-muted-foreground rounded px-1 py-0.5 text-xs"
                    : "bg-muted text-primary rounded px-2 py-1 text-sm"
                }
              >
                {children}
              </code>
            ) : (
              <pre
                className={
                  isSmallText
                    ? "bg-muted text-muted-foreground mb-1 overflow-x-auto rounded p-2 text-xs"
                    : "bg-muted text-foreground mb-4 overflow-x-auto rounded-lg p-4"
                }
              >
                <code>{children}</code>
              </pre>
            );
          },
          a: ({ href, children }) => (
            <a
              href={href}
              className={
                isSmallText
                  ? "text-muted-foreground hover:text-muted-foreground/80 text-xs underline"
                  : "text-primary hover:text-primary/80 underline"
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong
              className={
                isSmallText
                  ? "text-muted-foreground text-xs font-normal"
                  : "text-card-foreground font-semibold"
              }
            >
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em
              className={
                isSmallText
                  ? "text-muted-foreground text-xs italic"
                  : "text-foreground italic"
              }
            >
              {children}
            </em>
          ),
          table: ({ children }) => (
            <div
              className={
                isSmallText ? "mb-1 overflow-x-auto" : "mb-4 overflow-x-auto"
              }
            >
              <table
                className={
                  isSmallText
                    ? "border-border min-w-full rounded border text-xs"
                    : "border-border min-w-full rounded-lg border"
                }
              >
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th
              className={
                isSmallText
                  ? "border-border bg-muted text-muted-foreground border px-2 py-1 text-left text-xs font-normal"
                  : "border-border bg-muted text-card-foreground border px-4 py-2 text-left font-semibold"
              }
            >
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td
              className={
                isSmallText
                  ? "border-border text-muted-foreground border px-2 py-1 text-xs"
                  : "border-border text-foreground border px-4 py-2"
              }
            >
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
