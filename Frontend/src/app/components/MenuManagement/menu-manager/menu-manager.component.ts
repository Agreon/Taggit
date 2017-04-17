import {
  Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver,
  ReflectiveInjector
} from '@angular/core';
import {Subject} from "rxjs";
import {MainMenuComponent} from "../menus/main-menu/main-menu.component";
import {ProjectViewMenuComponent} from "../menus/project-view-menu/project-view-menu.component";

export enum MENU_TYPE {
  MAIN_MENU,
  PROJECT_VIEW
}

export class MenuEvent{
  constructor(
    public type: MENU_TYPE,
    public param: any = {}
  ){}
}

/**
 * TODO: Inject params to menu
 */
@Component({
  selector: 'menu-manager',
  templateUrl: './menu-manager.component.html',
  styleUrls: ['./menu-manager.component.css']
})
export class MenuManagerComponent implements OnInit {

  @ViewChild('menuContainer', {read: ViewContainerRef}) menuContainer;

  private changeMenu: Subject<MenuEvent> = new Subject<MenuEvent>();

  private menus = [
    MainMenuComponent,
    ProjectViewMenuComponent
  ];

  private factories = {};

  constructor(private resolver: ComponentFactoryResolver) {
  }


  private loadMenu(menuType: MENU_TYPE, param: any = {}){

    let factory = null;
    if(menuType == MENU_TYPE.MAIN_MENU){
      factory = this.resolver.resolveComponentFactory(MainMenuComponent);
    }else {
      factory = this.resolver.resolveComponentFactory(ProjectViewMenuComponent);
    }
    //let factory = null;
   /* if(this.factories[menuType]){
      factory = this.factories[menuType];
    } else {*/
      //let factory = this.resolver.resolveComponentFactory(MainMenuComponent);
    //this.resolver.resolveComponentFactory(this.menus[menuType]);
     // this.factories[menuType] = factory;
    //}

    this.menuContainer.clear();
    let menu = this.menuContainer.createComponent(factory);
    menu.instance.param = param;
    menu.instance.changeMenu = this.changeMenu;
  }

  ngOnInit() {
    this.changeMenu.subscribe(obj => {
      console.log(obj);
      this.loadMenu(obj.type, obj.param);
    });

    this.loadMenu(MENU_TYPE.MAIN_MENU);

  }

}
