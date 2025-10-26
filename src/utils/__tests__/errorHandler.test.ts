import { errorHandler, logger, ErrorCategory, ErrorSeverity } from '../errorHandler';

describe('Error Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('errorHandler', () => {
    it('should handle generic errors', () => {
      const error = new Error('Test error');
      const appError = errorHandler.handle(
        error,
        ErrorCategory.GENERAL,
        ErrorSeverity.ERROR
      );

      expect(appError.category).toBe(ErrorCategory.GENERAL);
      expect(appError.severity).toBe(ErrorSeverity.ERROR);
      expect(appError.message).toBe('Test error');
      expect(appError.timestamp).toBeDefined();
    });

    it('should handle database errors', () => {
      const dbError = new Error('Database connection failed');
      const appError = errorHandler.handleDatabaseError(dbError);

      expect(appError.category).toBe(ErrorCategory.DATABASE);
      expect(appError.severity).toBe(ErrorSeverity.ERROR);
    });

    it('should handle IAP errors', () => {
      const iapError = new Error('Purchase failed');
      const appError = errorHandler.handleIAPError(iapError);

      expect(appError.category).toBe(ErrorCategory.IAP);
      expect(appError.message).toContain('Purchase failed');
    });

    it('should handle AR errors', () => {
      const arError = new Error('AR session failed');
      const appError = errorHandler.handleARError(arError);

      expect(appError.category).toBe(ErrorCategory.AR);
    });

    it('should handle network errors', () => {
      const networkError = new Error('Network request failed');
      const appError = errorHandler.handleNetworkError(networkError);

      expect(appError.category).toBe(ErrorCategory.NETWORK);
    });

    it('should include context in error', () => {
      const error = new Error('Test error');
      const context = { userId: '123', action: 'save' };

      const appError = errorHandler.handle(
        error,
        ErrorCategory.GENERAL,
        ErrorSeverity.ERROR,
        context
      );

      expect(appError.context).toEqual(context);
    });

    it('should assign unique error IDs', () => {
      const error1 = errorHandler.handle(
        new Error('Error 1'),
        ErrorCategory.GENERAL,
        ErrorSeverity.ERROR
      );

      const error2 = errorHandler.handle(
        new Error('Error 2'),
        ErrorCategory.GENERAL,
        ErrorSeverity.ERROR
      );

      expect(error1.id).not.toBe(error2.id);
    });
  });

  describe('logger', () => {
    let consoleDebugSpy: jest.SpyInstance;
    let consoleInfoSpy: jest.SpyInstance;
    let consoleWarnSpy: jest.SpyInstance;
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
      consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
      consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
      consoleDebugSpy.mockRestore();
      consoleInfoSpy.mockRestore();
      consoleWarnSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it('should log debug messages', () => {
      logger.debug('Debug message', { key: 'value' });
      expect(consoleDebugSpy).toHaveBeenCalled();
    });

    it('should log info messages', () => {
      logger.info('Info message', { key: 'value' });
      expect(consoleInfoSpy).toHaveBeenCalled();
    });

    it('should log warning messages', () => {
      logger.warn('Warning message', { key: 'value' });
      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it('should log error messages', () => {
      logger.error('Error message', { key: 'value' });
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should include data in logs', () => {
      const data = { userId: '123', action: 'test' };
      logger.info('Test message', data);

      expect(consoleInfoSpy).toHaveBeenCalledWith(
        expect.stringContaining('Test message'),
        expect.objectContaining(data)
      );
    });
  });
});
