import { Test, TestingModule } from '@nestjs/testing';
import { ShoptoService } from './shopto.service';

describe('ShoptoService', () => {
  let service: ShoptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShoptoService],
    }).compile();

    service = module.get<ShoptoService>(ShoptoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
