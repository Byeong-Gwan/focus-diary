
/**
 * @description Daily 페이지
 * - 오늘 하루 할일 관리 (우선순위, 목표/실제 시간)
 * - 달성률 계산 및 색상 표시
 * - 한줄평 / 감사한 일 작성
 * - localStorage 연동
 *
 * @history
 * 2026-06-02 | 최초 작성 | Daily 할일 CRUD, 달성률 계산, localStorage 연동
 */

"use client"
import { useState, useEffect } from "react";
import { DailyTodo, DailyData } from "@/types/common";

// 달성률 색상 계산
function getAchievementColor(rate: number): string {
  if (rate < 50) return "text-red-500";
  if (rate < 70) return "text-yellow-500";
  if (rate < 100) return "text-green-500";
  return "text-blue-500";
}

// 축하 메시지
function getCelebrationMessage(rate: number): string | null {
    if (rate < 100) return null;
    const over = rate - 100;
    if (over === 0) return "🎉 목표 달성! 완벽한 하루예요!";
    return `🎊 ${over}% 초과 달성! 대단해요!`;
  }

// 오늘 날짜 포맷
function getTodayLabel(): string {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const dayName = dayNames[today.getDay()];
  return `${month}월 ${day}일 (${dayName})`;
}

const defaultData: DailyData = {
  todos: [],
  comment: "",
  gratitude: "",
};

export default function DailyPage() {
  const [data, setData] = useState<DailyData>(defaultData);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState<"높음" | "중간" | "낮음">("중간");
  const [targetTime, setTargetTime] = useState<number>(30);

  // localStorage 불러오기
  useEffect(() => {
    const saved = localStorage.getItem("dailyData");
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  // localStorage 저장
  useEffect(() => {
    localStorage.setItem("dailyData", JSON.stringify(data));
  }, [data]);

  // 달성률 계산
  const totalTarget = data.todos.reduce((sum, t) => sum + t.targetTime, 0);
  const totalActual = data.todos.reduce((sum, t) => sum + (t.done ? t.actualTime : 0), 0);
  const achievementRate = totalTarget === 0 ? 0 : Math.round((totalActual / totalTarget) * 100);

  // 할일 추가
  const handleAdd = () => {
    if (!input) return;
    const newTodo: DailyTodo = {
      id: Date.now(),
      text: input,
      priority,
      targetTime,
      actualTime: 0,
      done: false,
    };
    setData({ ...data, todos: [...data.todos, newTodo] });
    setInput("");
    setTargetTime(30);
  };

  // 완료 체크
  const handleToggle = (id: number) => {
    setData({
      ...data,
      todos: data.todos.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      ),
    });
  };

  // 실제 시간 업데이트
  const handleActualTime = (id: number, value: number) => {
    setData({
      ...data,
      todos: data.todos.map((t) =>
        t.id === id ? { ...t, actualTime: value } : t
      ),
    });
  };

  // 삭제
  const handleDelete = (id: number) => {
    setData({ ...data, todos: data.todos.filter((t) => t.id !== id) });
  };

  // 우선순위 순서 정렬
  const priorityOrder = { "높음": 0, "중간": 1, "낮음": 2 };
  const sortedTodos = [...data.todos].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">

        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
                📝 {getTodayLabel()}
            </h1>
            <div className="text-right">
                <div className={`text-4xl font-bold ${getAchievementColor(achievementRate)}`}>
                {achievementRate}%
                </div>
                {getCelebrationMessage(achievementRate) && (
                <div className="text-sm font-medium mt-1 animate-bounce">
                    {getCelebrationMessage(achievementRate)}
                </div>
                )}
            </div>
        </div>

        {/* 입력 영역 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex gap-2 mb-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.nativeEvent.isComposing) handleAdd();
              }}
              placeholder="할일 입력"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
            >
              추가
            </button>
          </div>

          <div className="flex gap-3 items-center">
            {/* 우선순위 선택 */}
            <div className="flex gap-1">
              {(["높음", "중간", "낮음"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    priority === p
                      ? p === "높음" ? "bg-red-500 text-white"
                        : p === "중간" ? "bg-yellow-500 text-white"
                        : "bg-gray-400 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* 목표 시간 */}
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">목표</span>
              <input
                type="number"
                value={targetTime}
                onChange={(e) => setTargetTime(Number(e.target.value))}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-xs text-center"
              />
              <span className="text-xs text-gray-500">분</span>
            </div>
          </div>
        </div>

        {/* 할일 목록 */}
        <ul className="space-y-2 mb-6">
          {sortedTodos.map((todo) => (
            <li key={todo.id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => handleToggle(todo.id)}
                  className="w-4 h-4 accent-blue-500"
                />
                <span className={`flex-1 text-sm ${todo.done ? "line-through text-gray-400" : "text-gray-700"}`}>
                  {todo.text}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  todo.priority === "높음" ? "bg-red-100 text-red-600"
                  : todo.priority === "중간" ? "bg-yellow-100 text-yellow-600"
                  : "bg-gray-100 text-gray-500"
                }`}>
                  {todo.priority}
                </span>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="text-gray-400 hover:text-red-500 text-xs"
                >
                  삭제
                </button>
              </div>

              {/* 시간 입력 */}
              <div className="flex gap-4 mt-2 ml-7 text-xs text-gray-500">
                <span>목표 {todo.targetTime}분</span>
                {todo.done && (
                  <div className="flex items-center gap-1">
                    <span>실제</span>
                    <input
                      type="number"
                      value={todo.actualTime}
                      onChange={(e) => handleActualTime(todo.id, Number(e.target.value))}
                      className="w-14 px-1 py-0.5 border border-gray-300 rounded text-center"
                    />
                    <span>분</span>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>

        {/* 통계 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>목표 시간 합계</span>
            <span className="font-bold">{totalTarget}분</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>실제 시간 합계</span>
            <span className="font-bold">{totalActual}분</span>
          </div>
        </div>

        {/* 한줄평 / 감사한 일 */}
        <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              ✏️ 한줄평
            </label>
            <input
              value={data.comment}
              onChange={(e) => setData({ ...data, comment: e.target.value })}
              placeholder="오늘 하루를 한 줄로 표현해봐요"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              🙏 감사한 일
            </label>
            <input
              value={data.gratitude}
              onChange={(e) => setData({ ...data, gratitude: e.target.value })}
              placeholder="오늘 감사했던 일을 적어봐요"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

      </div>
    </main>
  );
}