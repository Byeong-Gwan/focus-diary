import { WeeklyData } from "@/types/weekly";
import { dateToKey } from "@/lib/utils";

type Props = {
    isOpen: boolean;
    selectedDate: Date | null;
    monthlyData: WeeklyData;    // 1. 날짜별 할일 데이터
    onClose: () => void;        // 2. 닫기 함수
    onAdd: (date: Date, text: string) => void;  // 3. 할일 추가 함수
    onToggle: (date: Date, id: number) => void; // 4. 완료 체크
    onDelete: (date: Date, id: number) => void; // 5. 삭제
}

export default function MonthlyModal({
    isOpen,
    selectedDate,
    monthlyData,
    onClose,
    onAdd,
    onToggle,
    onDelete,
}: Props) {
    if (!isOpen || !selectedDate) {
        return null;
    }

    const dateKey = dateToKey(selectedDate);
    const todos = monthlyData[dateKey] || [];

    return (
        <div
        className="fixed inset-0 flex items-center justify-center z-50"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.15)" }}
        onClick={onClose}
        >
        <div
            className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
        >
            {/* 헤더 */}
            <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">
                📅 {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일
            </h2>
            <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-700 text-xl"
            >
                ✕
            </button>
            </div>

            {/* 할일 목록 */}
            <ul className="space-y-2 mb-4 max-h-60 overflow-y-auto">
            {todos.map((todo) => (
                <li key={todo.id} className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={todo.done}
                    onChange={() => onToggle(selectedDate, todo.id)}
                    className="w-4 h-4 accent-blue-500"
                />
                <span className={`flex-1 text-sm ${todo.done ? "line-through text-gray-400" : "text-gray-700"}`}>
                    {todo.text}
                </span>
                <button
                    onClick={() => onDelete(selectedDate, todo.id)}
                    className="text-gray-400 hover:text-red-500 text-xs"
                >
                    삭제
                </button>
                </li>
            ))}
            </ul>

            {/* 입력창 */}
            <div className="flex gap-2">
            <input
                id="modal-input"
                placeholder="할일 입력"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                onKeyDown={(e) => {
                if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                    onAdd(selectedDate, e.currentTarget.value);
                    e.currentTarget.value = "";
                }
                }}
            />
            <button
                onClick={() => {
                const input = document.getElementById("modal-input") as HTMLInputElement;
                onAdd(selectedDate, input.value);
                input.value = "";
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
            >
                추가
            </button>
            </div>
        </div>
        </div>
    );
}