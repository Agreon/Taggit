import {Component, EventEmitter, Input, OnInit, ViewChild} from '@angular/core';
import {ModalService} from "../../services/modal.service";
import {Subject} from "rxjs";
import {InputReceiver} from "../../models/input-receiver";
import {InputService} from "../../services/input.service";

export class ModalInput {
  constructor(
    public name: string,
    public value: string,
    public label?: string,
    public hidden: boolean = false
  ) {
    if(!label){
      this.label = name;
    }
  }
}

/**
 * TODO: Maybe some description text
 * OnKeyBoard-Input! is 'input-reciever'!
 */
export class ModalParameter {
  constructor(
    public header: string,
    public inputs: Array<ModalInput>,
    public onSubmit: EventEmitter<any>,
    public description?: string
  ) {}

  public getInput(name: string): ModalInput {
    return this.inputs.filter(input => {
      return input.name == name;
    })[0];
  }
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, InputReceiver {

  private parameter: ModalParameter;

  private visible = false;
  private visibleAnimate = false;

  @ViewChild('inputs') private inputs;

  constructor(private modalService: ModalService,
              private inputService: InputService) {
    // Recieve Parameters
    modalService.getModalParameter().subscribe(param => {
      this.parameter = param;
      this.show();
    });
  }

  ngOnInit() {
    this.inputService.addReciever("Modal", this);
  }


  keyEvent(event: KeyboardEvent) {
    if (event.keyCode == 27) {
      this.hide();
    }

    if (event.keyCode == 13) {
      this.onSubmit();
    }
  }

  public show(): void {
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true);
    this.inputService.setActive("Modal");
    console.log("Inputs",this.inputs);
 //   this.inputs.children[1].children[0].nativeElement.focus();
  }

  public hide(): void {
    this.visible = false;
    setTimeout(() => this.visibleAnimate = false);
  }

  public onSubmit(): void {
    this.parameter.onSubmit.emit(this.parameter.inputs);
    this.hide();
  }
}
