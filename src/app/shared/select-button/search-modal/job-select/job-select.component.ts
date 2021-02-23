import { Component, Input, OnInit } from '@angular/core';
import { Components } from '@ionic/core';
import { Subscription } from 'rxjs';
import { Job } from 'src/app/core/_models/job';
import { SimproService } from 'src/app/core/_services/simpro.service';


@Component({
  selector: 'app-job-select',
  templateUrl: './job-select.component.html',
  styleUrls: ['./job-select.component.scss'],
})
export class JobSelectComponent implements OnInit {
  @Input() popover: Components.IonPopover;
  @Input() jobs: Job[];

  public jobSub: Subscription;

  constructor(
    private simproService: SimproService
  ) { }

  ngOnInit() {
    this.getJobDetails();
  }

  ngOnDestroy() {
    this.jobSub?.unsubscribe();
  }

  public getJobDetails() {
    this.jobs.forEach((job) => {
      this.simproService.getJobDetails(job).subscribe((data) => {
        if (data?.data) {
          job.details = data.data;
        }
      });
    });
  }

  public jobSelected(job: Job) {
    this.popover.dismiss(job);
  }

  public stripHtml(html: string) {
    var div = document.createElement("div");
    div.innerHTML = html;
    return div.innerText;
  }
}
