# Koala Mail Man(Mandalart Goal Dashboard) - Frontend

만다라트 기법을 활용한 목표 관리 대시보드의 프론트엔드 애플리케이션

[Live](https://ringdong.kr/) | [Backend Repository](https://github.com/KoalaMailMan/koalamailman_backend)

## Screenshots
<img width="2880" height="1750" alt="메인 홈화면" src="https://github.com/user-attachments/assets/a75674b6-db2a-4d8a-b841-561f88a64b24" />

<img width="2880" height="1750" alt="대시보드 화면" src="https://github.com/user-attachments/assets/acaba5a7-9b20-47c4-91b1-7be386084c62" />



만다라트 기법을 활용한 목표 관리 대시보드
AI 기반 목표 추천과 이메일 리마인더를 제공합니다.


## Features

- 만다라트 3x3/9x9 그리드 기반 목표 시각화
- AI 기반 목표 추천 (실시간 스트리밍)
- 목표 상태 관리 및 수정
- 이메일 리마인더 설정


## 기술 스택
- **Framework**: Vite + React 18 + TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS + shadcn/ui
- **API**: Fetch API + SSE (Server-Sent Events)


## 실행 방법
> **⚠️ Note**: 백엔드 API 서버 없이 실행 시 UI는 정상 동작하지만, 다음 기능들은 작동하지 않습니다:
> - 목표 저장/불러오기
> - AI 목표 추천
> - 이메일 리마인더 설정


```bash
# Prerequisites: Node.js v20+

# 저장소 클론
git clone https://github.com/KoalaMailMan/frontend.git

# 폴더 이동
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

## Project Structure

```
src/
├── App.tsx
├── feature/
│   ├── auth/          # 로그인/로그아웃
│   ├── home/          # 메인 홈
│   ├── mandala/       # 만다라트 핵심 로직
│   ├── tutorial/      # 사용자 가이드
│   └── ui/            # shadcn/ui 컴포넌트
├── lib/
│   ├── api/           # API 통신 레이어 (요청/응답/에러 핸들링)
│   ├── stores/        # Zustand 상태 관리
│   └── utils.ts       # 유틸리티 함수
├── shared/
│   ├── components/    # 공용 컴포넌트
│   └── hooks/         # 커스텀 React Hooks
└── styles/            # 전역 스타일
```
