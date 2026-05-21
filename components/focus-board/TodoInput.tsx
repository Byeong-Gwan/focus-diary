type Props = {
    input: string;
    onChange: (value: string) => void;
    onAdd: () => void;
};

export default function TodoInput({ input, onChange, onAdd }: Props) {
    return (
        <div className="flex gap-2 mb-6">
            <input
                value={input}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                            onAdd();
                        }
                    }}
                placeholder="할 일을 입력하세요"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
                onClick={onAdd}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
                추가
            </button>
        </div>
    )
}