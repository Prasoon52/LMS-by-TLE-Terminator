import ReactMarkdown from "react-markdown";

export const GuidanceCard = ({ guidance }) => {
  const markdownComponents = {
    h2: ({ node, ...props }) => (
      <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-900 mt-10 mb-6 pt-6 border-t border-gray-200 first:border-t-0 first:pt-0">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-blue-600 font-bold">→</span>
        </div>
        <span {...props} />
      </h2>
    ),
    h3: ({ node, ...props }) => (
      <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
        <span {...props} />
      </h3>
    ),
    ul: ({ node, ...props }) => <ul className="space-y-3 my-6" {...props} />,
    li: ({ node, ...props }) => (
      <li className="flex items-start gap-3 text-gray-700" {...props}>
        <div className="w-1.5 h-1.5 bg-blue-300 rounded-full mt-2.5 flex-shrink-0"></div>
        <span className="leading-relaxed" {...props} />
      </li>
    ),
    p: ({ node, ...props }) => (
      <p className="text-gray-700 leading-relaxed mb-4" {...props} />
    ),
    strong: ({ node, ...props }) => (
      <strong className="font-bold text-gray-900" {...props} />
    ),
    blockquote: ({ node, ...props }) => (
      <div className="my-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-l-4 border-blue-400">
        <div className="text-gray-700 italic" {...props} />
      </div>
    ),
    code: ({ node, inline, ...props }) =>
      inline ? (
        <code
          className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md font-mono text-sm"
          {...props}
        />
      ) : (
        <code
          className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm"
          {...props}
        />
      ),
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-6 md:p-10 border border-gray-100/50">
      <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 md:p-8 border border-gray-100 shadow-inner">
        <div
          className="prose prose-lg max-w-none 
          prose-headings:font-bold prose-headings:text-gray-900
          prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
          prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
          prose-p:text-gray-700 prose-p:leading-relaxed
          prose-ul:my-4 prose-li:text-gray-700
          prose-strong:text-gray-900 prose-strong:font-semibold
          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
          prose-blockquote:border-l-4 prose-blockquote:border-blue-300
          prose-blockquote:pl-4 prose-blockquote:italic
          prose-pre:bg-gray-900 prose-pre:text-gray-100
          prose-code:text-gray-900 prose-code:bg-gray-100
          prose-code:px-2 prose-code:py-1 prose-code:rounded-md
          prose-table:border prose-table:border-gray-300
          prose-th:bg-gray-50 prose-th:text-gray-900
          prose-td:border prose-td:border-gray-200">
          <ReactMarkdown components={markdownComponents}>
            {guidance}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
