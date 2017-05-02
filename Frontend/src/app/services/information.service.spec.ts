import { TestBed, inject } from '@angular/core/testing';

import { UserInformationService } from './User-Information.service';

describe('UserInformationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserInformationService]
    });
  });

  it('should ...', inject([UserInformationService], (service: UserInformationService) => {
    expect(service).toBeTruthy();
  }));
});
