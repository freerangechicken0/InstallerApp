import { fakeAsync, TestBed } from '@angular/core/testing';
import { ToastController } from '@ionic/angular';

import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;
  let toastController;
  let toast;

  beforeEach(() => {
    toast = jasmine.createSpyObj('Toast', ['present']);
    toastController = jasmine.createSpyObj('ToastController', ['create']);
    toastController.create.and.returnValue(toast);
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ToastController,
          useValue: toastController
        }
      ]
    });
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('creates toast', fakeAsync(() => {
    service.createToast("validmessage");
    expect(toastController.create).toHaveBeenCalledWith({
      message: "validmessage",
      buttons: [
        {
          icon: 'close',
          role: 'cancel'
        }
      ],
      duration: 5000,
      color: 'dark'
    });
  }));

  it('creates error toast', () => {
    spyOn(service, 'createToast');
    service.errorToast('validmessage');
    expect(service.createToast).toHaveBeenCalledWith('validmessage', 'danger');
  });

  it('creates success toast', () => {
    spyOn(service, 'createToast');
    service.successToast('validmessage');
    expect(service.createToast).toHaveBeenCalledWith('validmessage', 'success');
  });
});
