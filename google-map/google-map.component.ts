import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Loader} from "@googlemaps/js-api-loader";

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent implements OnInit {

  @ViewChild('mapContainer', {static: true}) mapContainer: ElementRef;
  @ViewChild('searchBox', {static: true}) searchBox: ElementRef;

  map: google.maps.Map;
  marker: google.maps.Marker;

  @Input()
  latLng: google.maps.LatLngLiteral = {lat: 23.7625, lng: 90.3786};

  @Input()
  zoom: number = 14;

  @Input()
  locationSearch: boolean = true;

  @Input()
  locationDetails: boolean = true;

  @Output()
  changeLocationDetails: EventEmitter<google.maps.places.PlaceResult> = new EventEmitter<google.maps.places.PlaceResult>()

  @Output()
  changeLatLng: EventEmitter<google.maps.LatLngLiteral> = new EventEmitter<google.maps.LatLngLiteral>()


  constructor() {
  }

  ngOnInit() {
    this.loadGoogleMapsApi()
  }

  loadGoogleMapsApi() {
    const loader = new Loader({
      apiKey: 'AIzaSyBNhPHEV-qX7sWTH64esj_PSRf6Y7aHgJo',
      version: 'weekly',
      libraries: ['places']
    });

    loader.load().then(() => {
      this.initializeMap();
    });
  }

  public initializeMap() {
    const mapOptions: google.maps.MapOptions = {
      center: this.latLng,
      zoom: this.zoom,
      streetViewControl: false,
      mapTypeControl: false,
      streetView: null,
      zoomControl: false,
    };
    this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);
    this.onClickGetLocationDetails()

    if (this.locationSearch) this.addLocationSearch()

  }

  private addMarker(latLng: google.maps.LatLng) {
    const markerOptions: google.maps.MarkerOptions = {
      position: latLng,
      map: this.map

    };

    this.marker?.setMap(null)
    this.marker = new google.maps.Marker(markerOptions);
  }

  private clearMarkers() {
    this.marker?.setMap(null)
  }

  private addLocationSearch() {
    const input: any = this.searchBox?.nativeElement
    const autocomplete: google.maps.places.Autocomplete = new google.maps.places.Autocomplete(input, {
      componentRestrictions: {country: 'BD'}
    });

    autocomplete.addListener('place_changed', () => {
      const place: google.maps.places.PlaceResult = autocomplete.getPlace();
      if (!place?.geometry?.location) {
        console.log('Place not found.');
        return;
      }

      this.map.setCenter(place.geometry.location);
      this.map.setZoom(18);
      this.changeLatLng.emit(place.geometry?.location?.toJSON())

      this.clearMarkers();
      this.changeLocationDetailsByLatLng(place.geometry.location)
      this.addMarker(place.geometry.location);
    });
  }

  private onClickGetLocationDetails() {
    google.maps.event.addListener(this.map, 'click', (event) => {
      this.changeLatLng.emit(event?.latLng?.toJSON())
      this.changeLocationDetailsByLatLng(event?.latLng)
      this.addMarker(event.latLng);
    });
  }

  private changeLocationDetailsByLatLng(latLng: google.maps.LatLng) {
    const geocoder: google.maps.Geocoder = new google.maps.Geocoder();
    const request: google.maps.GeocoderRequest = {location: latLng};

    geocoder.geocode(request, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results?.length > 0) {
        this.changeLocationDetails.emit(results[0]);
      } else {
        console.log('Geocoder failed: ', status);
      }
    });
  }


}

