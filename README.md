# 동네빵집

React + TypeScript + Vite와 Vercel Functions로 만든 동네 빵집 검색 웹앱입니다. 사용자가 동네나 지명을 입력하면 서버리스 함수가 카카오 Local API 키워드 검색에 `빵집`을 붙여 요청하고, 결과를 카드 목록으로 보여줍니다.

## 주요 기능

- 앱 제목 `동네빵집`
- 동네/지명 검색 입력창과 검색 버튼
- `연남동` 입력 시 서버리스 함수에서 `연남동 빵집`으로 검색
- 로딩, 에러, 결과 없음 상태 표시
- 모바일 반응형 카드 UI
- 빵집 이름, 카테고리, 주소, 전화번호 표시
- `place_url` 기반의 **영업정보·리뷰 보기** 버튼 제공

## 설치 방법

```bash
npm install
```

## .env 설정 방법

프로젝트 루트에 `.env` 파일을 만들고 `.env.example` 형식에 맞춰 카카오 REST API 키를 넣어주세요.

```bash
cp .env.example .env
```

`.env` 파일 예시:

```env
KAKAO_REST_API_KEY=your_kakao_rest_api_key_here
```

## 카카오 REST API 키 넣는 방법

1. [카카오 Developers](https://developers.kakao.com/)에서 애플리케이션을 생성합니다.
2. 앱 키 메뉴에서 **REST API 키**를 복사합니다.
3. 루트 `.env` 파일의 `KAKAO_REST_API_KEY` 값으로 붙여넣습니다.

> 보안을 위해 프론트엔드에 노출되는 `VITE_KAKAO_REST_API_KEY` 같은 환경변수는 사용하지 않습니다. API 키는 Vercel Function인 `api/bakeries.ts` 안에서만 `process.env.KAKAO_REST_API_KEY`로 읽습니다.

## 로컬 실행 방법

개발 서버로 실행해 테스트합니다. `index.html`을 직접 열지 마세요.

```bash
npm run dev
```

브라우저에서 Vite가 안내하는 로컬 주소를 열고 검색어를 입력하세요.

## Vercel 배포 방법

1. Vercel에서 이 저장소를 Import합니다.
2. Framework Preset은 Vite로 설정합니다.
3. Build Command는 `npm run build`, Output Directory는 `dist`를 사용합니다.
4. Project Settings → Environment Variables에 아래 값을 등록합니다.

```env
KAKAO_REST_API_KEY=카카오_REST_API_키
```

5. 배포 후 Vercel Functions가 `/api/bakeries?q=동네이름` 요청을 처리합니다.

## 별점과 리뷰 수를 표시하지 않는 이유

카카오 Local API의 키워드 검색 공식 응답에는 별점과 리뷰 수가 포함되어 있지 않습니다. 따라서 이 앱은 별점/리뷰 수를 임의로 만들거나 표시하지 않고, 각 빵집의 `place_url`을 사용해 **영업정보·리뷰 보기** 버튼으로 연결합니다.

## 휴대폰 홈화면에 설치하는 방법

이 앱은 PWA manifest와 앱 아이콘을 제공하므로 모바일 브라우저에서 홈화면에 추가해 앱처럼 실행할 수 있습니다.

### Android Chrome

1. 배포된 동네빵집 사이트를 Chrome에서 엽니다.
2. 주소창 오른쪽의 메뉴(⋮)를 누릅니다.
3. **홈 화면에 추가** 또는 **앱 설치**를 선택합니다.
4. 이름을 확인한 뒤 **추가**를 누릅니다.

### iPhone Safari

1. 배포된 동네빵집 사이트를 Safari에서 엽니다.
2. 하단 공유 버튼을 누릅니다.
3. **홈 화면에 추가**를 선택합니다.
4. 이름을 확인한 뒤 **추가**를 누릅니다.
