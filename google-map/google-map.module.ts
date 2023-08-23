import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InputTextModule} from "primeng/inputtext";
import {GoogleMapsModule} from "@angular/google-maps";
import {GoogleMapComponent} from "@utility/google-map/google-map.component";

@NgModule({
  declarations: [GoogleMapComponent],
  imports: [
    CommonModule,
    GoogleMapsModule,
    InputTextModule,
  ],
  exports: [
    GoogleMapComponent
  ]
})
export class GoogleMapModule {
}
