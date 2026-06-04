/**
 * @description Monthly 페이지
 * - 이번 달 날짜 자동 계산 (1일 ~ 말일)
 * - 달력 그리드 UI (7열)
 * - 날짜별 할일 추가 / 완료 체크 기능
 * - localStorage 연동으로 데이터 영속성 유지
 *
 * @history
 * 2026-06-01 | 최초 작성 | 달력 그리드, 날짜별 할일 CRUD, localStorage 연동
 */

"use client"
import { useState, useEffect } from "react";
import { WeeklyData } from "@/types/weekly";
import { dateToKey } from "@/lib/utils";
import MonthlyModal from "./MonthlyModal";



function getMonthDates(): Date[] {
    const today = new Date(); // 오늘 날짜
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

    return Array.from({ length: lastDay }, (_, i) => {
        return new Date(today.getFullYear(), today.getMonth(), i + 1);
    });
}

export default function MonthlyPage() {
    const monthDates = getMonthDates();
     // 날짜별 할일 상태
    const [monthlyData, setMonthlyData] = useState<WeeklyData>({});
    // 1. 모달 열림/닫힘
    const [isOpen, setIsOpen] = useState(false);
    // 2. 어떤 날짜를 클릭했는지
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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

    const handleToggle = (date: Date, id: number) => {
        const dateKey = dateToKey(date);
        setMonthlyData({
          ...monthlyData,
          [dateKey]: monthlyData[dateKey].map((t) =>
            t.id === id ? { ...t, done: !t.done } : t
          )
        });
      };
      
    const handleDelete = (date: Date, id: number) => {
        const dateKey = dateToKey(date);
        setMonthlyData({
            ...monthlyData,
            [dateKey]: monthlyData[dateKey].filter((t) => t.id !== id)
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
                <div
                    key={i}
                    className="bg-white rounded-lg p-2 min-h-16 shadow-sm cursor-pointer hover:ring-2 hover:ring-blue-400"
                    onClick={() => {
                        setSelectedDate(date);
                        setIsOpen(true);
                    }}
                >
                    <p className="text-sm font-bold text-gray-700 mb-1">{i + 1}</p>

                    {/* 할일 목록 → 점으로 표시 */}
                    <div className="flex flex-wrap gap-1 mt-1">
                    {(monthlyData[dateToKey(date)] || []).map((todo) => (
                        <div
                        key={todo.id}
                        className={`w-2 h-2 rounded-full ${
                            todo.done ? "bg-green-400" : "bg-blue-400"
                        }`}
                        />
                    ))}
                    </div>

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
        <MonthlyModal
            isOpen={isOpen}
            selectedDate={selectedDate}
            monthlyData={monthlyData}
            onClose={() => setIsOpen(false)}
            onAdd={handleAdd}
            onToggle={handleToggle}
            onDelete={handleDelete}
        />
    </main>
    );
}