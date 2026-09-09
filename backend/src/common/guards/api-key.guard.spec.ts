import { ApiKeyGuard } from './api-key.guard.js';
import { ConfigService } from '@nestjs/config';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { describe, beforeEach, it, expect, vi } from 'vitest';

describe('ApiKeyGuard', () => {
  let guard: ApiKeyGuard;

  const mockConfigService = {
    get: vi.fn().mockReturnValue('valid-secret-key'),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    guard = new ApiKeyGuard(mockConfigService as unknown as ConfigService);
  });

  const createMockContext = (
    headerValue: string | undefined,
  ): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: headerValue ? { 'x-api-key': headerValue } : {},
        }),
      }),
    } as unknown as ExecutionContext;
  };

  it('át kell engednie a kérést, ha az x-api-key fejléc megegyezik a konfigurációval', () => {
    const context = createMockContext('valid-secret-key');
    expect(guard.canActivate(context)).toBe(true);
  });

  it('UnauthorizedException-t kell dobnia, ha a fejléc hibás kulcsot tartalmaz', () => {
    const context = createMockContext('rossz-kulcs');
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('UnauthorizedException-t kell dobnia, ha hiányzik a fejléc', () => {
    const context = createMockContext(undefined);
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });
});
