
import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-lg prose-gray max-w-none text-left ${className}`}>
      <ReactMarkdown
        components={{
          // Custom styling for code blocks
          code: ({ children, className, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code
                  className="bg-gray-100 px-2 py-1 rounded-md text-sm font-mono text-gray-800 border"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <div className="my-6">
                <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto border shadow-sm">
                  <code className="text-sm font-mono leading-relaxed" {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          },
          // Custom styling for tables
          table: ({ children }) => (
            <div className="overflow-x-auto my-6 shadow-sm border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="px-6 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider border-b">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-100">
              {children}
            </td>
          ),
          // Custom styling for headings
          h1: ({ children }) => (
            <h1 className="text-4xl font-bold mb-8 mt-8 text-gray-900 border-b-2 border-blue-200 pb-4 leading-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-3xl font-semibold mb-6 mt-12 text-gray-900 border-l-4 border-blue-500 pl-4 leading-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl font-semibold mb-4 mt-10 text-gray-900 leading-tight">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xl font-semibold mb-3 mt-8 text-gray-800 leading-tight">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-lg font-semibold mb-2 mt-6 text-gray-800 leading-tight">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-base font-semibold mb-2 mt-4 text-gray-700 leading-tight">
              {children}
            </h6>
          ),
          // Custom styling for paragraphs
          p: ({ children }) => (
            <p className="mb-6 text-gray-700 leading-relaxed text-base">
              {children}
            </p>
          ),
          // Custom styling for lists
          ul: ({ children }) => (
            <ul className="list-disc list-outside mb-6 space-y-2 pl-6 text-gray-700">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside mb-6 space-y-2 pl-6 text-gray-700">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-base leading-relaxed">
              {children}
            </li>
          ),
          // Custom styling for blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 bg-blue-50 pl-6 pr-4 py-4 my-6 italic text-gray-700 rounded-r-lg shadow-sm">
              {children}
            </blockquote>
          ),
          // Custom styling for links
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-2 hover:decoration-blue-800 transition-colors font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          // Custom styling for horizontal rules
          hr: () => (
            <hr className="my-8 border-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          ),
          // Custom styling for emphasis
          em: ({ children }) => (
            <em className="italic text-gray-800 font-medium">
              {children}
            </em>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-gray-900">
              {children}
            </strong>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
