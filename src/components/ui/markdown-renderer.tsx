
import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-gray max-w-none ${className}`}>
      <ReactMarkdown
        components={{
          // Custom styling for code blocks
          code: ({ children, className, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code
                  className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm font-mono" {...props}>
                  {children}
                </code>
              </pre>
            );
          },
          // Custom styling for tables
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-gray-200 bg-gray-50 px-4 py-2 text-left font-medium">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-200 px-4 py-2">
              {children}
            </td>
          ),
          // Custom styling for headings
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mb-6 text-gray-900 border-b pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold mb-4 mt-8 text-gray-900">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold mb-3 mt-6 text-gray-900">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-semibold mb-2 mt-4 text-gray-900">
              {children}
            </h4>
          ),
          // Custom styling for lists
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-1">
              {children}
            </ol>
          ),
          // Custom styling for blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-700">
              {children}
            </blockquote>
          ),
          // Custom styling for links
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-600 hover:text-blue-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
