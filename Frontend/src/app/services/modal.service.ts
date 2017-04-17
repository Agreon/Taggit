import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {ModalParameter} from "../components/MenuManagement/modal/modal.component";

@Injectable()
export class ModalService {

  private modalSubject = new Subject<ModalParameter>();

  constructor() { }

  public openModal(parameter: ModalParameter): void {
    this.modalSubject.next(parameter);
  }

  public getModalParameter(): Observable<ModalParameter> {
    return this.modalSubject.asObservable();
  }

}
