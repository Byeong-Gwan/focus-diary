# Focus Diary

> 해야 할 일을 관리하는 집중력 강화 웹 앱

## 프로젝트 소개

일상의 할 일을 등록하고, 완료 여부를 체크하며 진행 상황을 관리하는 웹 애플리케이션입니다.
새로고침해도 데이터가 유지되며, 필터 기능으로 진행 중인 항목과 완료 항목을 구분해서 볼 수 있습니다.

## 기술 스택

| Category | Tech |
| :--- | :--- |
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| 상태 관리 | React useState |
| 데이터 영속성 | localStorage |

## 주요 기능

- 할 일 추가 / 삭제
- 완료 체크 (취소선 표시)
- 필터링 (전체 / 진행중 / 완료)
- localStorage 연동 (새로고침 후에도 데이터 유지)
- 엔터키로 빠른 추가

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 접속

## 구현 예정

- [ ] TypeScript 타입 정의 강화
- [ ] 컴포넌트 분리
- [ ] Weekly 페이지
- [ ] Monthly 페이지

## 버전 히스토리

- v0.1.0 | 기본 CRUD 구현 (2026-05-13)
- v0.2.0 | 완료 체크 + Tailwind 디자인 (2026-05-18)
- v0.3.0 | localStorage 연동 + 필터 기능 (2026-05-20)