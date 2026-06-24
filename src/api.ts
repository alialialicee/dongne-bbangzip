import type { BakeriesResponse, Bakery, ErrorResponse } from './types';

export async function searchBakeries(query: string): Promise<Bakery[]> {
  const response = await fetch(`/api/bakeries?q=${encodeURIComponent(query)}`);
  const data = (await response.json()) as BakeriesResponse | ErrorResponse;

  if (!response.ok) {
    throw new Error('message' in data ? data.message : '빵집을 검색하지 못했어요.');
  }

  return (data as BakeriesResponse).bakeries;
}
