import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { Bakery } from '../src/types';

interface KakaoDocument {
  id: string;
  place_name: string;
  category_name: string;
  road_address_name: string;
  address_name: string;
  phone: string;
  place_url: string;
  distance?: string;
}

interface KakaoKeywordResponse {
  documents: KakaoDocument[];
}

function getSingleQueryParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function hasLocationParams(x: string | undefined, y: string | undefined) {
  return Boolean(x?.trim() && y?.trim());
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ message: 'GET 요청만 사용할 수 있어요.' });
  }

  const rawQuery = getSingleQueryParam(request.query.q);
  const q = rawQuery?.trim();
  const x = getSingleQueryParam(request.query.x)?.trim();
  const y = getSingleQueryParam(request.query.y)?.trim();
  const isLocationSearch = hasLocationParams(x, y);

  if (!q && !isLocationSearch) {
    return response.status(400).json({
      message: '검색할 동네나 지명을 q 파라미터로 전달하거나 현재 위치 좌표를 x/y 파라미터로 전달해 주세요.',
    });
  }

  const kakaoRestApiKey = process.env.KAKAO_REST_API_KEY;

  if (!kakaoRestApiKey) {
    return response.status(500).json({ message: '서버에 카카오 REST API 키가 설정되어 있지 않아요.' });
  }

  const searchParams = isLocationSearch
    ? new URLSearchParams({
        query: '빵집',
        x: x ?? '',
        y: y ?? '',
        radius: '2000',
        sort: 'distance',
        size: '15',
      })
    : new URLSearchParams({
        query: `${q} 빵집`,
        size: '15',
        page: '1',
      });

  try {
    const kakaoResponse = await fetch(
      `https://dapi.kakao.com/v2/local/search/keyword.json?${searchParams.toString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `KakaoAK ${kakaoRestApiKey}`,
        },
      },
    );

    if (!kakaoResponse.ok) {
      return response.status(kakaoResponse.status).json({
        message: '카카오 Local API에서 빵집 정보를 가져오지 못했어요. 잠시 후 다시 시도해 주세요.',
      });
    }

    const data = (await kakaoResponse.json()) as KakaoKeywordResponse;
    const bakeries: Bakery[] = data.documents.map((document) => ({
      id: document.id,
      place_name: document.place_name,
      category_name: document.category_name,
      road_address_name: document.road_address_name,
      address_name: document.address_name,
      phone: document.phone,
      place_url: document.place_url,
      distance: document.distance,
    }));

    return response.status(200).json({ bakeries });
  } catch (error) {
    console.error('Kakao Local API request failed:', error);
    return response.status(502).json({
      message: '카카오 Local API 요청 중 문제가 발생했어요. 네트워크 상태를 확인해 주세요.',
    });
  }
}
