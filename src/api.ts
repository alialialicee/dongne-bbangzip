import type { BakeriesResponse, Bakery, ErrorResponse } from './types';

export interface LocationSearchParams {
  latitude: number;
  longitude: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? '';
const BAKERIES_API_PATH = `${API_BASE_URL}/api/bakeries`;

async function fetchBakeries(searchParams: URLSearchParams): Promise<Bakery[]> {
  const response = await fetch(`${BAKERIES_API_PATH}?${searchParams.toString()}`);
  const data = (await response.json()) as BakeriesResponse | ErrorResponse;

  if (!response.ok) {
    throw new Error('message' in data ? data.message : '빵집을 검색하지 못했어요.');
  }

  return (data as BakeriesResponse).bakeries;
}

export async function searchBakeries(query: string): Promise<Bakery[]> {
  return fetchBakeries(new URLSearchParams({ q: query }));
}

export async function searchBakeriesByLocation({
  latitude,
  longitude,
}: LocationSearchParams): Promise<Bakery[]> {
  return fetchBakeries(
    new URLSearchParams({
      x: String(longitude),
      y: String(latitude),
    }),
  );
}
