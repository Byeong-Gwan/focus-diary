type Todo = {
    id: number;
    text: string;
    done: boolean;
};

type Props = {
    todo: Todo;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
};

export default function TodoItem({ todo, onToggle, onDelete }: Props) {
    return (
        <li className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg shadow-sm">
          <input
            type="checkbox"
            checked={todo.done}
            onChange={() => onToggle(todo.id)}
            className="w-4 h-4 accent-blue-500 cursor-pointer"
          />
          <span className={`flex-1 text-gray-700 ${todo.done ? "line-through text-gray-400" : ""}`}>
            {todo.text}
          </span>
          <button
            onClick={() => onDelete(todo.id)}
            className="text-gray-400 hover:text-red-500 transition-colors text-sm"
          >
            삭제
          </button>
        </li>
    );
}