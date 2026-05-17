/**
 * @description Focus Board 페이지
 * - 해야 할 일 / 하고 싶은 일 목록 관리
 * - 항목 추가 / 삭제 기능
 *
 * @history
 * 2026-05-13 | 최초 작성 | 기본 CRUD 구현 (추가, 삭제)
 */

"use client"
import { useState } from "react";

export default function Home() {
  // 할일 목록 담는 변수
  const [todos, setTodos] = useState([
    { id: 1, text: "React 기초 완성", done: false },
    { id: 2, text: "이직 지원·전략", done: false },
  ]);

  // 입력 영역 초기 값 빈값으로 셋팅
  const [input, setInput] = useState("");

  // 입력받은 내용 추가 및 초기화 영역 
  const handleAdd = () => {
    if (!input) {
      return;
    }

    // Date.now()를 i로 쓰는 이유: 추가 시점의 타임스탬프라 중복될 가능성이 없음
    setTodos([...todos, { id: Date.now(), text: input }]);
    setInput("");
  }

  return (
    <main>
      <h1>Focus Diary</h1>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="할 일 입력"
      />
      <button onClick={handleAdd}>추가</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() =>
                setTodos(todos.map((t) => 
                  t.id === todo.id ? { ...t, done: !t.done } : t
                ))
              } />
            {todo.text}
            {/* filter로 해당 id만 제외한 새 배열을 만들어 상태 업데이트 */}
            {/* todos를 직접 수정하지 않는 이유: React는 불변성을 유지해야 리렌더링이 감지됨 */}
            <button onClick={() => setTodos(todos.filter((t) => t.id !== todo.id))}>삭제</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
