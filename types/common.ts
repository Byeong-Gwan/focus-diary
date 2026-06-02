// types/common.ts
export type Todo = {
    id: number;
    text: string;
    done: boolean;
  };

  // Daily 할일 타입
  export type DailyTodo = {
    id: number;
    text: string;
    priority: "높음" | "중간" | "낮음";
    targetTime: number; // 목표 시간 (분)
    actualTime: number; // 실제 시간 (분)
    done: boolean;
  };

  // Daily 페이지 데이터 타입
  export type DailyData = {
    todos: DailyTodo[];
    comment: string;    // 한줄평
    gratitude: string;  // 감사한 일
  };