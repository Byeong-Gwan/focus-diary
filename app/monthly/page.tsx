"use client"
import { useState, useEffect } from "react";
import { WeeklyData } from "@/types/common";


function getMonthDates(): Date[] {
    const today = new Date(); // 오늘 날짜
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

    return Array.from({ length: lastDay }, (_, i) => {
        return new Date(today.getFullYear(), today.getMonth(), i + 1);
    });
}

// Date를 key값 문자열로 변환 "2026-05-26"
function dateToKey(date:Date): string {
    return date.toISOString().split("T")[0];
}

export default function MonthlyPage() {
    const monthDates = getMonthDates();
     // 날짜별 할일 상태
     const [monthlyData, setMonthlyData] = useState<WeeklyData>({});

     const handleAdd = (date: Date, text: string) => {
         if (!text) {
             return;
         }
 
         const dateKey = dateToKey(date);
 
         setMonthlyData({
             ...monthlyData,
             [dateKey]: [
                 ...(monthlyData[dateKey] || []),
                 { id: Date.now(), text, done: false }
             ]
         });
     };
 
     // localStorage에서 불러오기 (마운트 시 1회 실행)
     useEffect(() => {
         const saved = localStorage.getItem("monthlyData");
 
         if (saved) {
             setMonthlyData(JSON.parse(saved));
         }
     }, []);
 
     // todos 변경될 때마다 localStorage에 저장
     useEffect(() => {
         localStorage.setItem("monthlyData", JSON.stringify(monthlyData));
     }, [monthlyData]);

    return (
        <main className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              📆 Monthly — 2026년 6월
            </h1>
      
            {/* 요일 헤더 */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {["월", "화", "수", "목", "금", "토", "일"].map((d) => (
                <div key={d} className="text-center text-sm font-bold text-gray-500 py-2">
                  {d}
                </div>
              ))}
            </div>
      
            {/* 날짜 그리드 */}
            <div className="grid grid-cols-7 gap-1">
              {/* 1일 전 빈칸 */}
              {Array.from({ length: new Date(2026, 5, 1).getDay() === 0 ? 6 : new Date(2026, 5, 1).getDay() - 1 }, (_, i) => (
                <div key={`empty-${i}`} />
              ))}
      
                {monthDates.map((date, i) => (
                <div key={i} className="bg-white rounded-lg p-2 min-h-16 shadow-sm">
                    <p className="text-sm font-bold text-gray-700 mb-1">{i + 1}</p>

                    {/* 할일 목록 */}
                    <ul className="space-y-1">
                    {(monthlyData[dateToKey(date)] || []).map((todo) => (
                        <li key={todo.id} className="flex items-center gap-1">
                        <input
                            type="checkbox"
                            checked={todo.done}
                            onChange={() => {
                            const dateKey = dateToKey(date);
                            setMonthlyData({
                                ...monthlyData,
                                [dateKey]: monthlyData[dateKey].map((t) =>
                                t.id === todo.id ? { ...t, done: !t.done } : t
                                )
                            });
                            }}
                            className="w-3 h-3 accent-blue-500"
                        />
                        <span className={`text-xs ${todo.done ? "line-through text-gray-400" : "text-gray-600"}`}>
                            {todo.text}
                        </span>
                        </li>
                    ))}
                    </ul>

                    {/* 입력창 */}
                    <input
                    placeholder="+ 추가"
                    className="w-full text-xs text-gray-400 mt-1 outline-none"
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                        handleAdd(date, e.currentTarget.value);
                        e.currentTarget.value = "";
                        }
                    }}
                    />
                </div>
            ))}
            </div>
          </div>
        </main>
    );
}