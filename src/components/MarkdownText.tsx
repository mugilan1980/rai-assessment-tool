import ReactMarkdown, { type Components } from 'react-markdown'

interface MarkdownTextProps {
  content: string
}

const NAVY = '#1B2D5B'

const components: Components = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold mt-2 mb-4" style={{ color: NAVY }}>
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold mt-6 mb-3" style={{ color: NAVY }}>
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-semibold mt-4 mb-2" style={{ color: NAVY }}>
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-base text-gray-700 mb-3 leading-relaxed">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc pl-6 my-3 text-gray-700">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-6 my-3 text-gray-700">{children}</ol>
  ),
  li: ({ children }) => <li className="mb-1 leading-relaxed">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold" style={{ color: NAVY }}>
      {children}
    </strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline"
      style={{ color: '#00A79D' }}
    >
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="px-1.5 py-0.5 rounded bg-gray-100 text-sm font-mono text-gray-800">
      {children}
    </code>
  ),
  blockquote: ({ children }) => (
    <blockquote
      className="border-l-4 pl-4 my-3 italic text-gray-600"
      style={{ borderColor: '#93C5FD' }}
    >
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-6 border-gray-200" />,
}

export default function MarkdownText({ content }: MarkdownTextProps) {
  return <ReactMarkdown components={components}>{content}</ReactMarkdown>
}
