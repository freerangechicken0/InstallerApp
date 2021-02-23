import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Components } from '@ionic/core';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview/ngx';
import { Platform } from '@ionic/angular';
import { Product } from 'src/app/core/_models/product';
import { Transceiver } from 'src/app/core/_models/transceiver';
import { PhotoService } from 'src/app/core/_services/photo.service';
import { Photo } from 'src/app/core/_models/photo';
import { Subscription } from 'rxjs';
import { ToastService } from 'src/app/core/_services/toast.service';

@Component({
  selector: 'app-photos-modal',
  templateUrl: './photos-modal.component.html',
  styleUrls: ['./photos-modal.component.scss'],
})
export class PhotosModalComponent implements OnInit {
  @Input() modal: Components.IonModal;
  @Input() product: Product;
  @Input() transceivers: Transceiver[];
  public nVats: number;
  public currentVatIndex: number = 0;
  public noPhotos: boolean;

  public backSub: Subscription;

  public transceiverPhotoTemplate: Photo = {
    name: 'transceiver',
    value: 'Transceiver',
    vatId: null,
    photo: null
  }
  public vatPhotosTemplate: Photo[] = [
    {
      name: 'vat',
      value: 'Vat',
      vatId: null,
      photo: null
    },
    {
      name: 'lidar',
      value: 'Lidar',
      vatId: null,
      photo: null
    },
    {
      name: 'mag',
      value: 'Magnetometer',
      vatId: null,
      photo: null
    },
    {
      name: 'topCalbing',
      value: 'Top of vat cabling',
      vatId: null,
      photo: null
    },
    {
      name: 'backCalbing',
      value: 'Back of vat cabling',
      vatId: null,
      photo: null
    },
    {
      name: 'underCabling',
      value: 'Under vat cabling',
      vatId: null,
      photo: null
    },
    {
      name: 'inletTemp',
      value: 'Inlet temp sensor',
      vatId: null,
      photo: null
    },
    {
      name: 'vatTemp',
      value: 'Vat temp sensor',
      vatId: null,
      photo: null
    },
    {
      name: 'plug',
      value: 'Power plug',
      vatId: null,
      photo: null
    },
    {
      name: 'badge',
      value: 'Badge plate',
      vatId: null,
      photo: null
    }
  ];

  public transceiverPhotos: Photo[] = [];
  public vatPhotos: Photo[][] = [];

  public cameraPreviewOpts: CameraPreviewOptions = {
    x: 0,
    y: 56,
    width: this.platform.width(),
    height: (this.platform.height() - 56 - 216 - 58),
    camera: 'rear',
    tapPhoto: false,
    tapFocus: true,
    alpha: 1
  }

  public pictureOpts: CameraPreviewPictureOptions = {
    width: 1280,
    height: 1280,
    quality: 85
  }

  constructor(
    private platform: Platform,
    private cameraPreview: CameraPreview,
    private photoService: PhotoService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.nVats = this.product.vats.length;
    this.noPhotos = this.photoService.getNoPhotos();
    let existingPhotos = this.photoService.getPhotos();
    if (existingPhotos) {
      this.transceiverPhotos = existingPhotos.transceiverPhotos;
      this.vatPhotos = existingPhotos.vatPhotos;
    }
    else {
      [...new Set(this.transceivers)].forEach((uniqueTran) => {
        let photo = JSON.parse(JSON.stringify(this.transceiverPhotoTemplate));
        this.transceivers.forEach((tran, index) => {
          if (tran === uniqueTran) {
            this.transceiverPhotos[index] = photo;
          }
        });
      });
      this.product?.vats?.forEach((vat) => {
        this.vatPhotos.push(JSON.parse(JSON.stringify(this.vatPhotosTemplate)));
      });
    }
    this.openCamera();
  }

  public openCamera(): void {
    if (this.platform.is('cordova')) {
      this.cameraPreview.startCamera(this.cameraPreviewOpts).then(
        (res) => {
          this.backSub = this.platform.backButton.subscribeWithPriority(10000000, (processNextHandler) => {
            this.onClose();
          });
        },
        (err) => {
          console.log(err)
        });

    }
  }

  ngOnDestroy() {
    this.backSub?.unsubscribe();
  }

  public stopCamera(): void {
    this.cameraPreview.stopCamera();
  }

  public takePhoto(photo: Photo, index: number): void {
    if (this.platform.is('cordova')) {
      this.cameraPreview.takePicture(this.pictureOpts).then((imageData) => {
        photo.vatId = this.product.vats[index].id;
        photo.photo = 'data:image/jpeg;base64,' + imageData;
      });
    }
  }

  public goForward(): void {
    const nextIndex = this.currentVatIndex + 1 > this.nVats - 1 ? 0 : this.currentVatIndex + 1;
    this.currentVatIndex = nextIndex;
  }

  public goBack(): void {
    const nextIndex = this.currentVatIndex - 1 < 0 ? this.nVats - 1 : this.currentVatIndex - 1;
    this.currentVatIndex = nextIndex;
  }

  public onClose(): void {
    this.photoService.storePhotos(this.transceiverPhotos, this.vatPhotos);
    this.stopCamera();
    this.modal.dismiss();
  }

  public noPhotosPressed(): void {
    this.noPhotos = !this.noPhotos;
    this.photoService.setNoPhotos(this.noPhotos);
    if (this.noPhotos) {
      this.toastService.createToast("Photos are no longer required");
    }
    else {
      this.toastService.createToast("Photos are now required");
    }
  }
}
