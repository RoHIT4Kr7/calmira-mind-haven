const reactions = [
  { emoji: "❤️", label: "Love", value: "love" },
  { emoji: "😢", label: "Touched", value: "touched" },
  { emoji: "🌸", label: "Beautiful", value: "beautiful" },
  { emoji: "✨", label: "Inspired", value: "inspired" },
];

const Reactions = ({ userReaction, handleReaction }: any) => (
  <div className="mt-6 flex flex-wrap justify-center gap-4">
    {reactions.map((reaction) => (
      <button
        key={reaction.value}
        onClick={() => handleReaction(reaction.value)}
        className={`p-2 sm:p-3 md:p-4 rounded-full transition-all duration-200 hover:scale-110 ${
          userReaction === reaction.value
            ? "bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg"
            : "bg-black/20 backdrop-blur-sm border border-white/10 hover:bg-black/30"
        }`}
        title={reaction.label}
      >
        <span className="text-lg sm:text-xl md:text-2xl">{reaction.emoji}</span>
      </button>
    ))}
  </div>
);

export default Reactions;
