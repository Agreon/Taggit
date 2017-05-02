import { Component, OnInit } from '@angular/core';
import {ProjectService} from "../../services/project.service";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  constructor(private projectService: ProjectService) { }

  ngOnInit() {
    this.projectService.getCurrentDocument().subscribe(res => {
      console.log("Overview Doc", res);
    });
  }

}
