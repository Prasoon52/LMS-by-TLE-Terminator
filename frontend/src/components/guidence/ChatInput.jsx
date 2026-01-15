export const ChatInput = ({
  question,
  setQuestion,
  onSend,
  disabled,
  onKeyPress,
}) => (
  <div className="p-6 border-t border-gray-100">
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSend();
      }}
      className="relative">
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyPress={onKeyPress}
        placeholder="Ask a follow-up question..."
        className="w-full p-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        rows="2"
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={!question.trim() || disabled}
        className={`absolute right-3 bottom-3 p-2 rounded-lg ${
          !question.trim() || disabled
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-md"
        } transition-all duration-200`}>
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      </button>
    </form>
    <p className="text-xs text-gray-500 mt-2 text-center">
      Ask about career paths, skills, salaries, or clarifications
    </p>
  </div>
);
