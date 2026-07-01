import { FormEvent, useMemo, useState } from 'react';
import { searchBakeries, searchBakeriesByLocation } from './api';
import type { Bakery } from './types';

type SearchMode = 'query' | 'location' | '';
type ResultView = 'all' | 'distance';

function getDistanceValue(distance?: string) {
  const distanceValue = Number(distance);

  return Number.isFinite(distanceValue) ? distanceValue : Number.POSITIVE_INFINITY;
}

function App() {
  const [query, setQuery] = useState('');
  const [searchedQuery, setSearchedQuery] = useState('');
  const [searchMode, setSearchMode] = useState<SearchMode>('');
  const [bakeries, setBakeries] = useState<Bakery[]>([]);
  const [resultView, setResultView] = useState<ResultView>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setError('검색할 동네나 지명을 입력해 주세요.');
      setBakeries([]);
      setResultView('all');
      setSearchedQuery('');
      setSearchMode('');
      return;
    }

    setIsLoading(true);
    setError('');
    setSearchedQuery(trimmedQuery);
    setSearchMode('query');

    try {
      const results = await searchBakeries(trimmedQuery);
      setBakeries(results);
      setResultView('all');
    } catch (searchError) {
      setBakeries([]);
      setResultView('all');
      setError(searchError instanceof Error ? searchError.message : '알 수 없는 오류가 발생했어요.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleLocationSearch() {
    if (!navigator.geolocation) {
      setBakeries([]);
      setResultView('all');
      setSearchedQuery('');
      setSearchMode('');
      setError('이 브라우저에서는 현재 위치를 사용할 수 없어요. 직접 지역명을 입력해 주세요.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSearchedQuery('현재 위치');
    setSearchMode('location');

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const results = await searchBakeriesByLocation({
            latitude: coords.latitude,
            longitude: coords.longitude,
          });
          setBakeries(results);
          setResultView('all');
        } catch (searchError) {
          setBakeries([]);
          setResultView('all');
          setError(searchError instanceof Error ? searchError.message : '알 수 없는 오류가 발생했어요.');
        } finally {
          setIsLoading(false);
        }
      },
      () => {
        setBakeries([]);
        setResultView('all');
        setSearchedQuery('');
        setSearchMode('');
        setError('위치 권한이 필요해요. 직접 지역명을 입력해도 검색할 수 있어요.');
        setIsLoading(false);
      },
    );
  }

  const resultsTitle = searchMode === 'location' ? '현재 위치 주변 빵집' : `“${searchedQuery}” 빵집`;
  const emptyMessage =
    searchMode === 'location'
      ? '현재 위치 주변 빵집을 찾지 못했어요.'
      : `“${searchedQuery}” 주변 빵집을 찾지 못했어요.`;

  const hasDistanceResults = bakeries.some((bakery) => bakery.distance?.trim());
  const displayedBakeries = useMemo(() => {
    if (resultView !== 'distance') {
      return bakeries;
    }

    return [...bakeries].sort((a, b) => getDistanceValue(a.distance) - getDistanceValue(b.distance));
  }, [bakeries, resultView]);

  return (
    <main className="app-shell">
      <section className="hero" aria-labelledby="app-title">
        <p className="eyebrow">우리 동네 달콤한 산책</p>
        <h1 id="app-title">동네빵집</h1>
        <p className="hero-description">
          동네 이름을 입력하거나 현재 위치를 허용하면 카카오 Local API로 가까운 빵집을 찾아드려요.
        </p>

        <form className="search-form" onSubmit={handleSubmit}>
          <label htmlFor="search-input">동네 또는 지명</label>
          <div className="search-row">
            <input
              id="search-input"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="예: 연남동"
              autoComplete="off"
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? '검색 중...' : '검색'}
            </button>
            <button type="button" className="location-button" onClick={handleLocationSearch} disabled={isLoading}>
              현재 위치로 찾기
            </button>
          </div>
        </form>
      </section>

      <section className="results-section" aria-live="polite">
        {isLoading && <p className="status-message">따끈한 빵집 목록을 가져오는 중이에요...</p>}
        {error && <p className="status-message error">{error}</p>}
        {!isLoading && !error && searchedQuery && bakeries.length === 0 && (
          <p className="status-message">{emptyMessage}</p>
        )}
        {!isLoading && !error && bakeries.length > 0 && (
          <>
            <div className="results-heading">
              <h2>{resultsTitle}</h2>
              <div className="results-summary">
                <span>{bakeries.length}곳</span>
                <div className="result-controls" aria-label="검색 결과 보기 옵션">
                  <button
                    type="button"
                    className={resultView === 'all' ? 'active' : ''}
                    onClick={() => setResultView('all')}
                    aria-pressed={resultView === 'all'}
                  >
                    전체보기
                  </button>
                  {hasDistanceResults && (
                    <button
                      type="button"
                      className={resultView === 'distance' ? 'active' : ''}
                      onClick={() => setResultView('distance')}
                      aria-pressed={resultView === 'distance'}
                    >
                      가까운 순
                    </button>
                  )}
                </div>
              </div>
            </div>
            <ul className="bakery-list">
              {displayedBakeries.map((bakery) => (
                <li className="bakery-card" key={bakery.id || bakery.place_url}>
                  <div>
                    <p className="category">{bakery.category_name || '빵집'}</p>
                    <h3>{bakery.place_name}</h3>
                    <p className="address">{bakery.road_address_name || bakery.address_name}</p>
                    {bakery.distance && <p className="distance">현재 위치에서 약 {bakery.distance}m</p>}
                    {bakery.phone && <p className="phone">☎ {bakery.phone}</p>}
                  </div>
                  <div className="card-actions">
                    <p className="hours-note">영업시간과 휴무일은 카카오맵에서 확인해주세요.</p>
                    <a href={bakery.place_url} target="_blank" rel="noreferrer" className="review-link">
                      영업정보·리뷰 보기
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </main>
  );
}

export default App;
