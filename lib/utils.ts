/**
 * @description 공통 유틸 함수 모음
 * - 날짜 포맷 변환
 * - localStorage key 변환
 *
 * @history
 * 2026-06-02 | 최초 작성 | formatDate, dateToKey 함수 분리
 */

// 날짜 포맷 함수 "5월 26일 (월)"
export function formatDate(date: Date): string {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    const dayName = dayNames[date.getDay()];
    return `${month}월 ${day}일 (${dayName})`;
}
  
  // Date를 localStorage key로 변환 "2026-05-26"
export function dateToKey(date: Date): string {
    return date.toISOString().split("T")[0];
}