import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Components } from '@ionic/core';
import { Subscription } from 'rxjs';
import { Transceiver } from 'src/app/core/_models/transceiver';
import { MixpanelService } from 'src/app/core/_services/mixpanel.service';
import { ToastService } from 'src/app/core/_services/toast.service';
import { TransceiverService } from 'src/app/core/_services/transceiver.service';

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss'],
})
export class InfoModalComponent implements OnInit {
  @Input() modal: Components.IonModal;
  @Input() type: string;
  @Input() transceiver: Transceiver;
  public data: any[];
  public loadedData: any[];
  public count: number = 10;
  public lastTranCheckin: string = "N/A";
  public lastBoot: string = "N/A";
  public lastCell: string = "N/A";
  public lastCellStrength: number;
  public lastCheckins: string[] = [];
  public lastUpdated: number;

  public dataSub: Subscription;
  public bootSub: Subscription;
  public cellSub: Subscription;

  constructor(
    public transceiverService: TransceiverService,
    public toastService: ToastService,
    private mixpanelService: MixpanelService
  ) {
  }

  ngOnInit() {
    this.mixpanelService.trackEvent("Opened info screen for Transceiver: " + this.transceiver.serialNumber);
    this.getTransceiverData();
    this.getTransceiverCheckins();
    this.lastUpdated = Date.now();
  }

  ngOnDestroy() {
    this.dataSub?.unsubscribe();
    this.bootSub?.unsubscribe();
    this.cellSub?.unsubscribe();
  }

  getTransceiverData() {
    this.transceiverService.getTransceiverData(this.transceiver.id, null);
    this.dataSub = this.transceiverService.transceiverData.subscribe((data) => {
      if (data && data.length) {
        this.data = data;
        this.loadedData = this.data.slice(0, 10);
        this.findLastCheckins();
      }
    });
  }

  getTransceiverCheckins() {
    this.transceiverService.getTransceiverData(this.transceiver.id, "boot");
    this.bootSub = this.transceiverService.boot.subscribe((boot) => {
      if (boot) {
        this.lastBoot = boot;
      }
    });
    this.transceiverService.getTransceiverData(this.transceiver.id, "cell");
    this.cellSub = this.transceiverService.cell.subscribe((cell) => {
      if (cell) {
        this.lastCellStrength = cell.rssi;
        this.lastCell = cell.date;
      }
    });
  }

  findLastCheckins() {
    if (this.data && this.data.length) {
      let checkin = this.data.find(entry => entry.topic.startsWith("transceiver/"));
      if (checkin) {
        this.lastTranCheckin = checkin.date;
      }
    }

    this.lastCheckins = [];
    if (this.transceiver.sensors && this.transceiver.sensors.length) {
      for (var sensor of this.transceiver.sensors) {
        let checkin = this.data.find(entry => entry.topic.startsWith("sensor/" + sensor.uniqueId));
        if (checkin) {
          this.lastCheckins.push(checkin.date);
        }
        else {
          this.lastCheckins.push("N/A");
        }
      }
    }
  }

  doRefresh(event) {
    this.count = 10;
    this.mixpanelService.trackEvent("Refreshed Transceiver info");
    this.getTransceiverData();
    this.getTransceiverCheckins();

    setTimeout(() => {
      this.lastUpdated = Date.now();
      event?.target.complete();
    }, 1000);
  }

  doInfinite(event) {
    if (this.count < this.data.length) {
      this.count = this.count + 10;
      this.mixpanelService.trackEvent("Loaded " + this.count + " transceiver data entries");
      this.loadedData = this.data.slice(0, this.count);
    }
    event?.target.complete();
  }

  serialNumberFromUniqueId(topic: string): string {
    let info = topic.split("/");
    switch (info[0]) {
      case "sensor": {
        let sensor = this.transceiver.sensors.find(i => i.uniqueId === info[1]);
        if (sensor) {
          return sensor.serialNumber;
        }
        else {
          return topic;
        }
      }
      case "transceiver": {
        return this.transceiver.serialNumber;
      }
      default: {
        return topic;
      }
    }
  }

  findSensorType(topic: string): string {
    let info = topic.split("/");
    switch (info[0]) {
      case "sensor": {
        let sensor = this.transceiver.sensors.find(i => i.uniqueId === topic.split("/")[1])
        if (sensor) {
          return sensor.type;
        }
        else {
          return null;
        }
      }
      default: {
        return null;
      }
    }
  }

  rebootTransceiver() {
    this.transceiverService.rebootTransceiver(this.transceiver.id).subscribe(data => {
      if (data.data) {
        this.mixpanelService.trackEvent("Rebooted Transceiver: " + this.transceiver.serialNumber);
        this.toastService.successToast("Reboot message has been sent");
      }
      else {
        this.toastService.errorToast("Transceiver reboot failed");
      }
    });
  }

  onClose() {
    this.modal.dismiss();
  }

}
