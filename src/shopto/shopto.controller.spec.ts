import { Test, TestingModule } from '@nestjs/testing';
import { ShoptoController } from './shopto.controller';

describe('ShoptoController', () => {
  let controller: ShoptoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShoptoController],
    }).compile();

    controller = module.get<ShoptoController>(ShoptoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
