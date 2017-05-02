import {Component, Input, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent implements OnInit {

  @Input()
  Value: number = 0;

  private currentWidth: string = "0%";

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes["Value"]){
      this.currentWidth = this.Value+"%";
    }
  }

}
