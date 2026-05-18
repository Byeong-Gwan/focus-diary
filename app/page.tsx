/**
 * @description Focus Board 페이지
 * - 해야 할 일 / 하고 싶은 일 목록 관리
 * - 항목 추가 / 삭제 / 완료 체크 기능
 *
 * @history
 * 2026-05-13 | 최초 작성 | 기본 CRUD 구현 (추가, 삭제)
 * 2026-05-17 | 완료 체크 기능 추가
 * 2026-05-18 | Tailwind CSS 디자인 적용
 */

"use client"
import { useState, useEffect } from "react";

export default function Home() {
  // 할일 목록 담는 변수
  const [todos, setTodos] = useState([]);

  // 입력 영역 초기 값 빈값으로 셋팅
  const [input, setInput] = useState("");

  // 입력받은 내용 추가 및 초기화 영역 
  const handleAdd = () => {
    if (!input) {
      return;
    }

    // Date.now()를 i로 쓰는 이유: 추가 시점의 타임스탬프라 중복될 가능성이 없음
    setTodos([...todos, { id: Date.now(), text: input, done: false }]);
    setInput("");
  }

  // localStorage에서 불러오기 (마운트 시 1회 실행)
  useEffect(() => {
    const saved = localStorage.getItem("todos");

    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  // todos 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-lg mx-auto">

        {/* 헤더 */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          📋 Focus Board
        </h1>

        {/* 입력 영역 */}
        <div className="flex gap-2 mb-6">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="할 일을 입력하세요"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            추가
          </button>
        </div>

        {/* 할일 목록 */}
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg shadow-sm"
            >
              {/* 완료 체크박스 */}
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() =>
                  setTodos(todos.map((t) =>
                    t.id === todo.id ? { ...t, done: !t.done } : t
                  ))
                }
                className="w-4 h-4 accent-blue-500 cursor-pointer"
              />

              {/* 텍스트 - 완료시 취소선 */}
              <span className={`flex-1 text-gray-700 ${todo.done ? "line-through text-gray-400" : ""}`}>
                {todo.text}
              </span>

              {/* 삭제 버튼 */}
              <button
                onClick={() => setTodos(todos.filter((t) => t.id !== todo.id))}
                className="text-gray-400 hover:text-red-500 transition-colors text-sm"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>

        {/* 완료 개수 표시 */}
        <p className="text-sm text-gray-400 mt-4">
          {todos.filter((t) => t.done).length} / {todos.length} 완료
        </p>

      </div>
    </main>
  );
}