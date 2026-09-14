import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-trips',
  imports: [RouterLink, FormsModule],
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

  newTrip = {
    destination: '',
    startDate: '',
    endDate: '',
    status: 'Geplant'
  };

  successMessage = '';
  messageType: 'success' | 'error' = 'success';

  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }

  addTrip(): void {
  if (!this.newTrip.destination.trim()) {
    this.messageType = 'error';
    this.successMessage = 'Bitte gib ein Reiseziel ein.';
    return;
  }

  if (!this.newTrip.startDate || !this.newTrip.endDate) {
    this.messageType = 'error';
    this.successMessage = 'Bitte gib ein Start- und Enddatum ein.';
    return;
  }

  const today = new Date().toISOString().split('T')[0];

  if (this.newTrip.startDate < today) {
    this.messageType = 'error';
    this.successMessage = 'Das Startdatum darf nicht in der Vergangenheit liegen.';
    return;
  }

  if (this.newTrip.endDate < this.newTrip.startDate) {
    this.messageType = 'error';
    this.successMessage = 'Das Enddatum darf nicht vor dem Startdatum liegen.';
    return;
  }

  this.trips.push({
    destination: this.newTrip.destination,
    startDate: this.newTrip.startDate,
    endDate: this.newTrip.endDate,
    status: this.newTrip.status
  });

  this.messageType = 'success';
  this.successMessage = 'Reise wurde hinzugefügt.';

  this.newTrip = {
    destination: '',
    startDate: '',
    endDate: '',
    status: 'Geplant'
  };
}

}
