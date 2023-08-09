import { TestBed } from '@angular/core/testing';

import { TokenHandlingInterceptor } from './token-handling.interceptor';

describe('TokenHandlingInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      TokenHandlingInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: TokenHandlingInterceptor = TestBed.inject(TokenHandlingInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
