import { FormEvent, useState } from 'react';
import { searchBakeries } from './api';
import type { Bakery } from './types';

function App() {
  const [query, setQuery] = useState('');
  const [searchedQuery, setSearchedQuery] = useState('');
  const [bakeries, setBakeries] = useState<Bakery[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setError('검색할 동네나 지명을 입력해 주세요.');
      setBakeries([]);
      setSearchedQuery('');
      return;
    }

    setIsLoading(true);
    setError('');
    setSearchedQuery(trimmedQuery);

    try {
      const results = await searchBakeries(trimmedQuery);
      setBakeries(results);
    } catch (searchError) {
      setBakeries([]);
      setError(searchError instanceof Error ? searchError.message : '알 수 없는 오류가 발생했어요.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="app-shell">
      <section className="hero" aria-labelledby="app-title">
        <p className="eyebrow">우리 동네 달콤한 산책</p>
        <h1 id="app-title">동네빵집</h1>
        <p className="hero-description">
          동네 이름을 입력하면 카카오 Local API로 가까운 빵집을 찾아드려요.
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
          </div>
        </form>
      </section>

      <section className="results-section" aria-live="polite">
        {isLoading && <p className="status-message">따끈한 빵집 목록을 가져오는 중이에요...</p>}
        {error && <p className="status-message error">{error}</p>}
        {!isLoading && !error && searchedQuery && bakeries.length === 0 && (
          <p className="status-message">“{searchedQuery}” 주변 빵집을 찾지 못했어요.</p>
        )}
        {!isLoading && !error && bakeries.length > 0 && (
          <>
            <div className="results-heading">
              <h2>“{searchedQuery}” 빵집</h2>
              <span>{bakeries.length}곳</span>
            </div>
            <ul className="bakery-list">
              {bakeries.map((bakery) => (
                <li className="bakery-card" key={bakery.id || bakery.place_url}>
                  <div>
                    <p className="category">{bakery.category_name || '빵집'}</p>
                    <h3>{bakery.place_name}</h3>
                    <p className="address">{bakery.road_address_name || bakery.address_name}</p>
                    {bakery.phone && <p className="phone">☎ {bakery.phone}</p>}
                  </div>
                  <a href={bakery.place_url} target="_blank" rel="noreferrer" className="review-link">
                    카카오맵에서 리뷰 보기
                  </a>
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
