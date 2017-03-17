import { Component, OnInit } from '@angular/core';
import {ProjectService} from "../services/project.service";

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  private documentName;

  constructor(private projectService: ProjectService) {
      this.documentName = this.projectService.getCurrentDocument()
        .filter(d => !!d) // Check againts null
        .map(d => d.name);
  }

  ngOnInit() {
  }

}
