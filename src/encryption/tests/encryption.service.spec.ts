import { Test } from '@nestjs/testing';
import { EncryptionService } from '../encryption.service';

describe('EncryptionService', () => {
  let ecnryptionService: EncryptionService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [EncryptionService],
    }).compile();

    ecnryptionService = moduleRef.get<EncryptionService>(EncryptionService);
  });

  it('should be defined', () => {
    expect(ecnryptionService).toBeDefined();
  });

  it('should create a hash by given data and compare the same data with encrpyted data', async () => {
    const data = 'Hello World';
    const encryptedData = await ecnryptionService.hash(data);
    const sameDataCompareResult = await ecnryptionService.compare(
      data,
      encryptedData,
    );
    const invalidDataCompareResult = await ecnryptionService.compare(
      'Invalid Data',
      encryptedData,
    );

    expect(sameDataCompareResult).toBe(true);
    expect(invalidDataCompareResult).toBe(false);
  });
});
