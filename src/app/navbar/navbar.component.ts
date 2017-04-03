import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {ProjectService} from "../services/project.service";

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Output("OnToggle")
  onToggle: EventEmitter<any> = new EventEmitter<any>();

  private documentName;

  constructor(private projectService: ProjectService) {
      this.documentName = this.projectService.getCurrentDocument()
        .filter(d => !!d) // Check againts null
        .map(d => d.name);
  }

  ngOnInit() {
  }


  toggleSidebar(){
    this.onToggle.emit();
  }

}
