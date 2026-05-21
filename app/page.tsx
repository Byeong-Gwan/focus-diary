/**
 * @description Focus Board 페이지
 * - 해야 할 일 / 하고 싶은 일 목록 관리
 * - 항목 추가 / 삭제 / 완료 체크 기능
 *
 * @history
 * 2026-05-13 | 최초 작성 | 기본 CRUD 구현 (추가, 삭제)
 * 2026-05-17 | 완료 체크 기능 추가
 * 2026-05-18 | Tailwind CSS 디자인 적용, localStorage 연동
 * 2026-05-20 | 필터 기능 추가 (전체/진행중/완료)
 */


"use client"
import { useState, useEffect } from "react";
import TodoItem from "@/components/focus-board/TodoItem";
import TodoInput from "@/components/focus-board/TodoInput";
import TodoFilter from "@/components/focus-board/TodoFilter";

// Todo 아이템 타입 정의
type Todo = {
  id: number;
  text: string;
  done: boolean;
};

// 필터 타입 정의
type FilterType = "전체" | "진행중" | "완료";

export default function Home() {
  // 할일 목록 담는 변수
  const [todos, setTodos] = useState<Todo[]>([]);

  // 입력 영역 초기 값 빈값으로 셋팅
  const [input, setInput] = useState("");

  // 현재 선택된 필터 상태
  const [filter, setFilter] = useState<"전체" | "진행중" | "완료">("전체");

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

  // 필터에 따라 보여줄 목록 계산
  const filteredTodos = todos.filter((todo) => {
    if (filter === "진행중") {
      return !todo.done;
    }

    if (filter === "완료") {
      return todo.done;
    }

    return true; // 전체
  });

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-lg mx-auto">

        {/* 헤더 */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          📋 Focus Board
        </h1>

        {/* 입력 영역 */}
       <TodoInput
          input={input}
          onChange={setInput}
          onAdd={handleAdd}
       />

        {/* 필터 버튼 */}
       <TodoFilter
          filter={filter}
          onFilterChange={setFilter}
       />

        {/* 할일 목록 */}
        <ul className="space-y-2">
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={(id) =>
                setTodos(todos.map((t) =>
                  t.id === id ? { ...t, done: !t.done } : t
                ))
              }
              onDelete={(id) =>
                setTodos(todos.filter((t) => t.id !== id))
              }
            />
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
