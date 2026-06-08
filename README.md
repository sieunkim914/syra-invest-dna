# SYRA Invest DNA

SYRA Invest DNA는 기업 분석, 투자 코치 채팅, 사용자 투자 성향 프로필을 하나의 모바일 우선 경험으로 묶은 React + Vite + TypeScript 핀테크 프로토타입입니다.

## 실행

```bash
npm install
npm run dev
```

브라우저에서 Vite가 안내하는 로컬 주소를 열면 됩니다.

## 앱 구조

앱은 항상 표시되는 하단 탭 4개로 구성됩니다.

- `Home`: 서비스 소개와 투자 DNA 요약
- `Analyze`: 기업명 또는 티커 기반 AI 투자 적합도 분석
- `Chat`: 종목, 재무제표, 투자 아이디어, 첨부파일을 자유롭게 상담하는 독립 AI 투자 채팅 (`/chat-tab`)
- `Profile`: High Conviction Explorer 투자 성향 상세 프로필

주요 파일 구조:

```text
src/
  main.tsx
  app/
    App.tsx
    components/
      Screen1Home.tsx
      Screen2Input.tsx
      Screen3Result.tsx
      Screen4Chat.tsx
      ChatTab.tsx
      ProfileTab.tsx
      BottomTabBar.tsx
  styles/
    index.css
    tailwind.css
    theme.css
    fonts.css
```

## 환경 변수

OpenAI API를 사용하려면 `.env` 파일 또는 Vercel 환경 변수에 아래 값을 설정하세요.

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

API 키가 없어도 앱은 fallback 분석과 fallback 채팅 응답으로 동작합니다.

## Vercel 배포

이 프로젝트는 Vercel 서버리스 함수 구조를 사용합니다.

- `api/analyze.js`: 기업 투자 적합도 분석 API
- `api/chat.js`: 독립 AI 투자 채팅 API

Vercel 프로젝트 설정에서 `OPENAI_API_KEY`를 환경 변수로 추가한 뒤 배포하면 됩니다.

## 파일 업로드 데모 제한

`Chat` 탭은 MVP용 클라이언트 파일 처리를 사용합니다.

- `.txt`, `.csv`, `.md`, `.json` 파일은 브라우저의 `FileReader`로 텍스트를 읽어 채팅 API에 전달합니다.
- `.pdf`, `.docx`, `.png`, `.jpg`, `.jpeg` 파일은 첨부 파일로 표시하지만, 데모 모드에서는 파일명, 타입, 크기만 전달합니다.
- PDF, 문서, 이미지의 실제 내용 분석은 아직 구현하지 않았습니다. 필요한 경우 핵심 문장이나 수치를 채팅에 붙여넣으면 투자 관점으로 요약할 수 있습니다.

## 주의

본 앱의 응답은 투자 참고용 분석이며 수익을 보장하지 않습니다. 최종 투자 판단과 책임은 사용자에게 있습니다.
