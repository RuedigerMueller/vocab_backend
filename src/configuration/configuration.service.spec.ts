import { Test, TestingModule } from '@nestjs/testing';
import { ConfigurationService } from './configuration.service';

describe('ConfigurationService', () => {
  let service: ConfigurationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigurationService],
    }).compile();

    service = module.get<ConfigurationService>(ConfigurationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDueInDays', () => {
    it('should return values for supported levels', () => {
      expect(service.getDueInDays(1)).toBeDefined();
      expect(service.getDueInDays(2)).toBeDefined();
      expect(service.getDueInDays(3)).toBeDefined();
      expect(service.getDueInDays(4)).toBeDefined();
      expect(service.getDueInDays(5)).toBeDefined();
      expect(service.getDueInDays(6)).toBeDefined();
    });

    it('should return 0 for not supported levels', () => {
      expect(service.getDueInDays(-1)).toBe(0);
      expect(service.getDueInDays(0)).toBe(0);
      expect(service.getDueInDays(7)).toBe(0);
      expect(service.getDueInDays(8)).toBe(0);
    })
  })
});
