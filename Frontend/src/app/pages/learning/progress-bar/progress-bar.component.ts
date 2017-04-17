import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent implements OnInit {

  @Input()
  Value: number = 0;

  private currentWidth: string = "width: 0%";

  constructor() { }

  ngOnInit() {
    this.currentWidth = "width: 50%";
  }

  ngOnChanges(){

  }

}
