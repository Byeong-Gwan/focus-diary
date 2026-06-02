/**
 * @description Weekly 페이지
 * - 이번 주 날짜 7일 자동 계산 (월~일)
 * - 날짜별 할일 추가 / 삭제 / 완료 체크 기능
 * - localStorage 연동으로 데이터 영속성 유지
 *
 * @history
 * 2026-05-26 | 최초 작성 | 날짜별 할일 CRUD, localStorage 연동
 */

"use client"
import { useState, useEffect } from "react";
import { WeeklyData } from "@/types/common"; 
import { formatDate, dateToKey } from "@/lib/utils";


// 이번 주 날짜 7일 배열 반환
function getWeekDates(): Date[] {
    const today = new Date(); // 오늘 날짜
    const day = today.getDay(); // 오늘 일자 
    const monday = new Date(today)
    monday.setDate(today.getDate() - (day === 0 ? 6: day - 1));
    // 시간을 00: 00: 00으로 초기화 (timezone 영향 제거)
    monday.setHours(0, 0, 0, 0);

    // 월요일 부터 7일 배열 만들기
    return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        return date;
    });
}

export default function WeeklyPage() {
    const weekDates = getWeekDates();

    // 날짜별 할일 상태
    const [weeklyData, setWeeklyData] = useState<WeeklyData>({});

    const handleAdd = (date: Date, text: string) => {
        if (!text) {
            return;
        }

        const dateKey = dateToKey(date);

        setWeeklyData({
            ...weeklyData,
            [dateKey]: [
                ...(weeklyData[dateKey] || []),
                { id: Date.now(), text, done: false }
            ]
        });
    };

    // localStorage에서 불러오기 (마운트 시 1회 실행)
    useEffect(() => {
        const saved = localStorage.getItem("weeklyData");

        if (saved) {
            setWeeklyData(JSON.parse(saved));
        }
    }, []);

    // todos 변경될 때마다 localStorage에 저장
    useEffect(() => {
        localStorage.setItem("weeklyData", JSON.stringify(weeklyData));
    }, [weeklyData]);
    
    return (
        <main className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                📅 Weekly
                </h1>
        
                {weekDates.map((date, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-4">
                    <h2 className="font-bold text-gray-700 mb-2">
                    {formatDate(date)}
                    </h2>

                    {/* 입력창 */}
                    <div className="flex gap-2 mb-2">
                        <input
                            placeholder="할 일 입력"
                            className="flex-1 px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                                handleAdd(date, e.currentTarget.value);
                                e.currentTarget.value = "";
                            }
                            }}
                        />
                        <button
                            onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            handleAdd(date, input.value);
                            input.value = "";
                            }}
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                        >
                            추가
                        </button>
                    </div>

                    {/* 할일 목록 */}
                    <ul className="space-y-1">
                    {(weeklyData[dateToKey(date)] || []).map((todo) => (
                        <li key={todo.id} className="flex items-center gap-2 text-sm text-gray-700">
                            <input
                                type="checkbox"
                                checked={todo.done}
                                onChange={() => {
                                const dateKey = dateToKey(date);
                                setWeeklyData({
                                    ...weeklyData,
                                    [dateKey]: weeklyData[dateKey].map((t) =>
                                    t.id === todo.id ? { ...t, done: !t.done } : t
                                    )
                                });
                                }}
                                className="w-4 h-4 accent-blue-500"
                            />
                            <span className={todo.done ? "line-through text-gray-400" : ""}>
                                {todo.text}
                            </span>
                            <button
                                onClick={() => {
                                    const dateKey = dateToKey(date);
                                    setWeeklyData({
                                        ...weeklyData,
                                        [dateKey]: weeklyData[dateKey].filter((t) => t.id !== todo.id)
                                    });
                                }}
                                className="text-gray-400 hover:text-red-500 text-xs ml-auto"
                                >
                                삭제
                            </button>
                        </li>
                    ))}
                    </ul>
                </div>
                ))}
            </div>
        </main>
    );
}