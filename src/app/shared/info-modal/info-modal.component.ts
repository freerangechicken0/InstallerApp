import { Component, Input, OnInit } from '@angular/core';
import { Components } from '@ionic/core';
import { Transceiver } from 'src/app/core/_models/transceiver';
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
  public lastTranCheckin: string = "N/A";
  public lastCheckins: string[] = [];
  public lastUpdated: Date;

  constructor(
    public transceiverService: TransceiverService,
    public toastService: ToastService
  ) {
   }

  ngOnInit() {
    this.lastCheckins = Array(this.transceiver.sensors.length).fill("N/A");
    this.getTransceiverData();
    this.lastUpdated = new Date();
  }

  getTransceiverData() {
    this.transceiverService.getTransceiverData(this.transceiver.id).subscribe(data => {
      this.data = data.data;
      console.log(data);
      this.findLastCheckins();
    });
  }

  findLastCheckins() {
    let entry = this.data.find(entry => entry.topic.startsWith("transceiver/"));
    if (entry) {
      this.lastTranCheckin = entry.date;
    }

    this.lastCheckins = [];
    for (var sensor of this.transceiver.sensors) {
      let entry = this.data.find(entry => entry.topic.startsWith("sensor/" + sensor.uniqueId));
      if (entry) {
        this.lastCheckins.push(entry.date);
      }
      else {
        this.lastCheckins.push("N/A");
      }
    }
  }

  doRefresh(event) {
    this.transceiverService.getTransceiverData(this.transceiver.id).subscribe(data => {
      this.data = data.data;
      console.log(data);
      this.findLastCheckins();
      this.lastUpdated = new Date();
      event.target.complete();
    });
  }

  serialNumberFromUniqueId(topic: string): string {
    let info = topic.split("/");
    switch(info[0]) {
      case "sensor": {
        return this.transceiver.sensors.find(i => i.uniqueId === topic.split("/")[1]).serialNumber;
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
    switch(info[0]) {
      case "sensor": {
        return this.transceiver.sensors.find(i => i.uniqueId === topic.split("/")[1]).type;
      }
      default: {
        return null;
      }
    }
  }

  rebootTransceiver() {
    this.transceiverService.rebootTransceiver(this.transceiver.id).subscribe(data => {
      if (data.data) {
        this.toastService.createToast("Reboot message has been sent");
      }
      else {
        this.toastService.createToast("Transceiver reboot failed");
      }
    });
  }

  onClose() {
    this.modal.dismiss();
  }

}
