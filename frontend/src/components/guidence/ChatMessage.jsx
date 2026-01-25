import ReactMarkdown from "react-markdown";

export const ChatMessage = ({ message }) => {
  const isUser = message.role === "user";

  const markdownComponents = {
    h3: ({ node, ...props }) => (
      <h3
        className={`text-lg font-semibold mt-3 mb-2 ${
          isUser ? "text-white" : "text-gray-800"
        }`}
        {...props}
      />
    ),
    ul: ({ node, ...props }) => (
      <ul className="space-y-1 my-2 ml-4" {...props} />
    ),
    li: ({ node, ...props }) => (
      <li
        className={`flex items-start gap-2 ${
          isUser ? "text-white/90" : "text-gray-700"
        }`}
        {...props}>
        <span className="mt-2">•</span>
        <span {...props} />
      </li>
    ),
    p: ({ node, ...props }) => (
      <p
        className={`mb-2 leading-relaxed ${
          isUser ? "text-white/90" : "text-gray-700"
        }`}
        {...props}
      />
    ),
    strong: ({ node, ...props }) => (
      <strong
        className={`font-semibold ${isUser ? "text-white" : "text-gray-900"}`}
        {...props}
      />
    ),
    code: ({ node, inline, ...props }) => (
      <code
        className={`px-1.5 py-0.5 rounded ${
          isUser ? "bg-white/20 text-white/90" : "bg-gray-100 text-gray-800"
        } text-sm font-mono`}
        {...props}
      />
    ),
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6`}>
      <div
        className={`max-w-[85%] md:max-w-[75%] ${
          isUser ? "order-2" : "order-1"
        }`}>
        <div
          className={`rounded-2xl p-5 ${
            isUser
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none"
              : "bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-bl-none"
          }`}>
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isUser
                  ? "bg-white/20"
                  : "bg-gradient-to-r from-blue-100 to-indigo-100"
              }`}>
              {isUser ? (
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              )}
            </div>
            <div>
              <span
                className={`text-sm font-medium ${
                  isUser ? "text-white/90" : "text-gray-700"
                }`}>
                {isUser ? "You" : "Career Assistant"}
              </span>
              <span
                className={`text-xs ml-2 ${
                  isUser ? "text-white/70" : "text-gray-500"
                }`}>
                {message.timestamp}
              </span>
            </div>
          </div>
          <div className={`prose max-w-none ${isUser ? "prose-invert" : ""}`}>
            <ReactMarkdown components={markdownComponents}>
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};
