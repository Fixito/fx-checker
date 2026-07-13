import { http, HttpResponse } from 'msw';

import { FRANKFURTER_API_URL } from '@/api/frankfurter';

export const handlers = [
  http.get(`${FRANKFURTER_API_URL}/rates`, ({ request }) => {
    const url = new URL(request.url);
    const base = url.searchParams.get('base');
    const quote = url.searchParams.get('quotes');

    return HttpResponse.json([{ base, date: '2026-06-17', quote, rate: 0.861_44 }]);
  }),
];
