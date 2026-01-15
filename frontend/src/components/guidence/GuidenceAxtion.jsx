export const GuidanceActions = ({ onGenerate, onToggleChat, showChat }) => (
  <div className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap gap-4">
    <button
      onClick={onGenerate}
      className="px-8 py-3.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center gap-3 group">
      <svg
        className="w-5 h-5 group-hover:rotate-90 transition-transform"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      Generate New Roadmap
    </button>
    <button
      onClick={onToggleChat}
      className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center gap-3 group">
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
      {showChat ? "Hide Chat" : "Ask Follow-up Questions"}
    </button>
  </div>
);
