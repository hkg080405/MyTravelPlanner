import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  showTrips = false;

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

  openTrips(): void {
    this.showTrips = true;
  }
}
