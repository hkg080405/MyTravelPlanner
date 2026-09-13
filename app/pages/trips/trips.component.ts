import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-trips',
  imports: [RouterLink],
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.scss'
})
export class TripsComponent {
  trips = [
    {
      destination: 'Barcelona',
      startDate: '2026-10-10',
      endDate: '2026-10-15',
      status: 'Geplant'
    },
    {
      destination: 'Rom',
      startDate: '2026-11-05',
      endDate: '2026-11-10',
      status: 'Aktiv'
    }
  ];

  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
