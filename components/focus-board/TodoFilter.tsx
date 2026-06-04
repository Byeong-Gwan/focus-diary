type FilterType = "전체" | "진행중" | "완료";

type Props = {
    filter: FilterType;
    onFilterChange: (filter: FilterType) => void;
};

export default function TodoFilter({ filter, onFilterChange }: Props) {
    return (
        <div className="flex gap-2 mb-4">
        {(["전체", "진행중", "완료"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => onFilterChange(f)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              filter === f
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-500 border border-gray-300 hover:border-blue-400"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
    )
}