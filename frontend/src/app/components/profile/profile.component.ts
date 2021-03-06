import { Component } from '@angular/core';
import { AuthenticationService, UserDetails, NewPlaceDetails } from '../../authentication.service';
import { DriveService } from '../../drive.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Injectable } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
@Injectable()
export class ProfileComponent {
  details: UserDetails;
  loadingData = true;
  places = [];
  copyOfPlaces = [];
  searchedName = "";

  constructor(public auth: AuthenticationService, public dialog: MatDialog, 
    public _DomSanitizationService: DomSanitizer, public drive: DriveService) { }

  ngOnInit() {    
    this.auth.profile().subscribe(user => {
      this.details = user;
      this.getPlaceList();
    }, (err) => {
    });
  }

  addNewPlace() {
    const dialogRef = this.dialog.open(AddNewPlaceDialog, {
      width: '800px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getPlaceList();
    });
  }

  getPlaceList() {
    this.loadingData = true;
    this.places = [];
    this.auth.placeList().subscribe(places => {
      var self = this;
      places.data.forEach(function(place) {
        var imagePath = self._DomSanitizationService.bypassSecurityTrustUrl('data:image/jpg;base64,' + place.imgBase64);
        place.imgBase64 = imagePath;

        self.places.push(place);
      });

      this.loadingData = false;
      this.copyPlaces();
    }, (err) => {
    });
  }

  viewPlaceDetails(_id) {
    this.drive.setPlaceId(_id);
    this.dialog.open(ViewPlaceDetailsDialog, {
      width: '800px'
    });
  }

  deletePlace(_id) {
    this.auth.deletPlace(_id).subscribe(response => {
      this.getPlaceList();
    }, (err) => {
    });
  }

  copyPlaces() {
    this.copyOfPlaces = Object.assign([], this.places);
  }

  searchPlace() {
    if(!this.searchedName || this.searchedName == "") {
      this.copyPlaces();
    } else {
      this.copyOfPlaces = Object.assign([], this.places).filter(
        item => item.name.toLowerCase().indexOf(this.searchedName.toLowerCase()) > -1
     )
    }
  }
}


@Component({
  selector: 'add-new-place-dialog',
  templateUrl: 'add-new-place-dialog.html',
})
export class AddNewPlaceDialog {

  placeDetails: NewPlaceDetails = {
    name: '',
    description: '',
    address: '',
    file: File = null,
    userName: '',
    userId: ''
  };

  constructor(public dialogRef: MatDialogRef<AddNewPlaceDialog>, 
    private auth: AuthenticationService) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onFileChanged(event) {
    this.placeDetails.file = <File>event.target.files[0];
  }

  onSave(): void {
    var fd = new FormData();

    this.placeDetails.userName = this.auth.getUserDetails().name;
    this.placeDetails.userId = this.auth.getUserDetails()._id;
    
    fd.append('file', this.placeDetails.file, this.placeDetails.file.name);
    fd.append('name', this.placeDetails.name);
    fd.append('description', this.placeDetails.description);
    fd.append('address', this.placeDetails.address);
    fd.append('userName', this.placeDetails.userName);
    fd.append('userId', this.placeDetails.userId);

    this.auth.saveNewPlace(fd).subscribe(() => {
      this.onCancel();
    }, (err) => {
    });
  }
}


@Component({
  selector: 'view-place-details-dialog',
  templateUrl: 'view-place-details-dialog.html',
})
export class ViewPlaceDetailsDialog {

  placeDetail = {
    name: '',
    description: '',
    address: '',
    userName: '',
    imgBase64: ''
  };

  loadingPlaceDetails = true;

  constructor(public dialogRef: MatDialogRef<ViewPlaceDetailsDialog>, 
    private auth: AuthenticationService, 
    public drive: DriveService,
    public _DomSanitizationService: DomSanitizer) { }

  ngOnInit() {
    this.loadingPlaceDetails = true;
    this.auth.getPlaceDetail(this.drive.getPlaceId()).subscribe(place => {
      place.data.imgBase64 = this._DomSanitizationService.bypassSecurityTrustUrl('data:image/jpg;base64,' + place.data.imgBase64);
      this.placeDetail = place.data;
      this.loadingPlaceDetails = false;
    },(err) => {
    });
  }

  onDone() {
    this.loadingPlaceDetails = false;
    this.dialogRef.close();
  }
}