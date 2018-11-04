import { Injectable } from '@angular/core';

@Injectable()
export class DriveService {
  plaseId = "";

  constructor() { }

  public setPlaceId(_id) : void {
    this.plaseId = _id;
  }

  public getPlaceId() {
    return this.plaseId;
  }
}
