import { describe, it, expect } from 'vitest';
import { POST } from '@/app/api/export/route';

const makeReq = (body: any) => new Request('http://test', { method: 'POST', body: JSON.stringify(body) });

describe('export route', () => {
  it('returns 400 when build is incomplete', async () => {
    const req = makeReq({ buildState:{ isComplete:false }, modules:[], accessories:[], options:{}, screenshot:'' });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
