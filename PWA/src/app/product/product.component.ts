import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { products, coordonnee, produitFlottant } from './dummyData';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit {

  // Global var
  products; // Product data detail
  coordonnee; // Product vector data
  distanceTable = []; // Distance between baryCentre and vectors
  positionProductPropose = 0;

  produitFlottant = produitFlottant; // Array produitFlottant table

  // control variable
  disabled = true;
  checkedBox = [];

  constructor(public dialog: MatDialog) {
    // this.pushNoti();
  }

  ngOnInit() {

    // ----- Fetch API ------
    // todo

    // Import dummyData
    // Replace by fetch API ...
    this.products = products;
    this.coordonnee = coordonnee;
  }

  ngAfterContentChecked() {
    let count = 0;

    if (this.checkedBox.length > 0) {
      this.checkedBox.forEach((e) => {
        if (e === true) {
          count = count + 1;
        }
      });
    }

    if (count >= 3) {
      this.disabled = false;
    } else {
      this.disabled = true;
    }
  }

  // ---------- List function---------------

  // Function check and fill produitFlottant
  fillProduitFlottant(arrSelected: any, baryCentre: any): void {
    arrSelected.forEach((e) => {
      if (this.produitFlottant[e]) { // This is produitFlottant
        this.coordonnee[e] = baryCentre; // Fill new value for produitFlottant
      }
    });
  }

  // Function calculate distance table
  calDistanceTable(baryCentre: any): void {
    this.coordonnee.forEach((e) => {
      let tmp = this.calDistance(e, baryCentre);
      this.distanceTable.push(tmp);
    });
  }

  // Function calculate distance between 2 vector
  calDistance(v1: any, v2: any): any {
    let distance = 0;

    let x = v1.male - v2.male;
    let y = v1.female - v2.female;
    let z = v1.groupUnder25 - v2.groupUnder25;
    let t = v1.groupOver25 - v2.groupOver25;

    distance = Math.sqrt(Math.pow((x), 2) + Math.pow((y), 2) + Math.pow((z), 2) + Math.pow((t), 2));

    return distance;
  }

  // Function calculate baryCentre
  calCoord(arrTmp: any): any {
    let purePF = true; // variable to check produitFlottant is pure?

    console.log('1st step');
    // ------------------ Calculate baryCentre 1st step
    let diviser = 0;
    let baryCentre = {
      male: 0, female: 0, groupUnder25: 0, groupOver25: 0
    };

    arrTmp.forEach((e) => {
      // Check this number is not produit flottant
      if (!this.produitFlottant[e]) {
        baryCentre.male = baryCentre.male + this.coordonnee[e].male;
        baryCentre.female = baryCentre.female + this.coordonnee[e].female;
        baryCentre.groupUnder25 = baryCentre.groupUnder25 + this.coordonnee[e].groupUnder25;
        baryCentre.groupOver25 = baryCentre.groupOver25 + this.coordonnee[e].groupOver25;

        diviser = diviser + 1;
      } else if (this.produitFlottant[e] && this.coordonnee[e].male !== null) {
        purePF = false; // no longer PURE
      }

      // Log
      console.log(`Coord [${e}]`);
      console.log(this.coordonnee[e]);
    });

    // Calculate baryCentre
    baryCentre.male = baryCentre.male / diviser;
    baryCentre.female = baryCentre.female / diviser;
    baryCentre.groupUnder25 = baryCentre.groupUnder25 / diviser;
    baryCentre.groupOver25 = baryCentre.groupOver25 / diviser;

    // Log
    console.log("Coord baryCentre: ");
    console.log(baryCentre);

    // -------------- Check produitFlottant to re-calculate baryCentre

    if (!purePF) { // only do 2nd step when existed at least 1 produit flottant not pure
      console.log('2nd step');

      let newDiviser = 1; // Should be from 1 because we already have vector baryCentre1

      arrTmp.forEach((e) => {
        // Check this number is produit flottant
        if (this.produitFlottant[e]) {
          baryCentre.male = baryCentre.male + this.coordonnee[e].male;
          baryCentre.female = baryCentre.female + this.coordonnee[e].female;
          baryCentre.groupUnder25 = baryCentre.groupUnder25 + this.coordonnee[e].groupUnder25;
          baryCentre.groupOver25 = baryCentre.groupOver25 + this.coordonnee[e].groupOver25;

          newDiviser = newDiviser + 1;
        }
      });
      // Calculate baryCentre
      baryCentre.male = baryCentre.male / newDiviser;
      baryCentre.female = baryCentre.female / newDiviser;
      baryCentre.groupUnder25 = baryCentre.groupUnder25 / newDiviser;
      baryCentre.groupOver25 = baryCentre.groupOver25 / newDiviser;
    }
    return baryCentre;
  }

  // Function handle Dialog 
  openDialog(): void {
    // Calculate coord propose product
    let arrTmp = [];
    this.checkedBox.forEach((e, i) => {
      if (e === true) {
        arrTmp.push(i);
      }
    });

    // Calculate baryCentre
    let baryCentre = this.calCoord(arrTmp);

    // Check and fill produitFlottant
    this.fillProduitFlottant(arrTmp, baryCentre);

    // Calculate distance table
    this.distanceTable = []; // Reset data
    this.calDistanceTable(baryCentre);
    console.log(this.distanceTable); // Log

    // Min position
    this.positionProductPropose = this.distanceTable.indexOf(Math.min(...this.distanceTable));
    console.log(this.positionProductPropose); // Log

    // Handle dialog
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: this.products[this.positionProductPropose]
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  // Function handle edit modal
  openDialogEdit(i: any): void {
    // Handle dialog
    const dialogRef = this.dialog.open(DialogEdit, {
      width: '250px',
      data: { detail: this.products[i], coord: this.coordonnee[i] }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog.html',
})
export class DialogOverviewExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'dialog-edit',
  templateUrl: 'dialogEdit.html',
})
export class DialogEdit {

  productEditForm: FormGroup;
  dataRef: any;

  constructor(
    public dialogRef: MatDialogRef<DialogEdit>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder) {

    // Binding data of Product Component via MAT_DIALOG_DATA
    this.dataRef = data;

    this.createProductEditForm();
  }

  // Function push notification
  pushNoti() {

    navigator.serviceWorker.ready
      .then(function (registration) {
        return registration.pushManager.getSubscription()
          .then(async function (subscription) {
            if (subscription) {
              return subscription;
            }

            const response = await fetch('http://localhost:3000/vapidPublicKey');
            const vapidPublicKey = await response.text();

            const convertedVapidKey = vapidPublicKey;
            return registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: convertedVapidKey
            });
          }).then(function (subscription) {

            fetch('http://localhost:3000/sendNotification', {
              method: 'post',
              headers: {
                'Content-type': 'application/json'
              },
              body: JSON.stringify({
                subscription: subscription
              }),
            });
          });
      })

  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  onClickSubmit() {
    // Use javascript properties "Pass by Reference" to change data
    // Better solution: use @Input / @Output & EventEmitter / @ViewChild & AfterViewInit for sharing data
    this.dataRef.coord.male = parseInt(this.productEditForm.value.male);
    this.dataRef.coord.female = parseInt(this.productEditForm.value.female);
    this.dataRef.coord.groupUnder25 = parseInt(this.productEditForm.value.groupUnder25);
    this.dataRef.coord.groupOver25 = parseInt(this.productEditForm.value.groupOver25);

    // Call noti function
    this.pushNoti();

    // Turn off dialog
    this.dialogRef.close();
  }

  createProductEditForm() {
    this.productEditForm = this.formBuilder.group({
      male: this.dataRef.coord.male ? this.dataRef.coord.male : 0,
      female: this.dataRef.coord.female ? this.dataRef.coord.female : 0,
      groupUnder25: this.dataRef.coord.groupUnder25 ? this.dataRef.coord.groupUnder25 : 0,
      groupOver25: this.dataRef.coord.groupOver25 ? this.dataRef.coord.groupOver25 : 0
    });
  }
}