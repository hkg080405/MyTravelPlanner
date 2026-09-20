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

  activities = [
    {
      name: 'Sagrada Família besichtigen',
      location: 'Barcelona',
      date: '2026-10-11',
      category: 'Sehenswürdigkeit',
      status: 'Geplant'
    },
    {
      name: 'Kolosseum besuchen',
      location: 'Rom',
      date: '2026-11-06',
      category: 'Museum',
      status: 'Geplant'
    }
  ];

  newActivity = {
    name: '',
    location: '',
    date: '',
    category: '',
    status: 'Geplant'
  };

  newTrip = {
    destination: '',
    startDate: '',
    endDate: '',
    status: 'Geplant'
  };

  editTripData = {
    destination: '',
    startDate: '',
    endDate: '',
    status: 'Geplant'
  };

  editActivityData = {
    name: '',
    location: '',
    date: '',
    category: '',
    status: 'Geplant'
  };

  editingActivityIndex: number | null = null;
  isActivityEditModalOpen = false;
  editingIndex: number | null = null;
  isEditModalOpen = false;
  successMessage = '';
  messageType: 'success' | 'error' = 'success';

  constructor(private location: Location) { }

  get today(): string {
    return new Date().toISOString().split('T')[0];
  }

  get selectedTripStartDate(): string {
    const selectedTrip = this.trips.find(
      trip => trip.destination === this.newActivity.location
    );

    return selectedTrip?.startDate ?? '';
  }

  get selectedTripEndDate(): string {
    const selectedTrip = this.trips.find(
      trip => trip.destination === this.newActivity.location
    );

    return selectedTrip?.endDate ?? '';
  }

  goBack(): void {
    this.location.back();
  }

  addTrip(): void {
    if (!this.newTrip.destination.trim()) {
      this.showError('Bitte gib ein Reiseziel ein.');
      return;
    }

    if (!this.newTrip.startDate || !this.newTrip.endDate) {
      this.showError('Bitte gib ein Start- und Enddatum ein.');
      return;
    }

    if (!this.isDateRangeValid(this.newTrip.startDate, this.newTrip.endDate)) {
      return;
    }

    this.trips.push({ ...this.newTrip });
    this.showSuccess('Reise wurde hinzugefügt.');

    this.newTrip = {
      destination: '',
      startDate: '',
      endDate: '',
      status: 'Geplant'
    };
  }

  addActivity(): void {
    if (!this.newActivity.name.trim()) {
      this.showError('Bitte gib einen Namen für die Aktivität ein.');
      return;
    }

    if (!this.newActivity.location) {
      this.showError('Bitte wähle eine Reise aus.');
      return;
    }

    if (!this.newActivity.date) {
      this.showError('Bitte gib ein Datum für die Aktivität ein.');
      return;
    }

    if (!this.newActivity.category) {
      this.showError('Bitte wähle eine Kategorie aus.');
      return;
    }

    const selectedTrip = this.trips.find(
      trip => trip.destination === this.newActivity.location
    );

    if (
      selectedTrip &&
      (this.newActivity.date < selectedTrip.startDate ||
        this.newActivity.date > selectedTrip.endDate)
    ) {
      this.showError(
        'Das Aktivitätsdatum muss innerhalb des Reisezeitraums liegen.'
      );
      return;
    }

    this.activities.push({ ...this.newActivity });
    this.showSuccess('Aktivität wurde hinzugefügt.');

    this.newActivity = {
      name: '',
      location: '',
      date: '',
      category: '',
      status: 'Geplant'
    };
  }

  editActivity(
    activity: {
      name: string;
      location: string;
      date: string;
      category: string;
      status: string;
    },
    index: number
  ): void {
    this.editingActivityIndex = index;
    this.editActivityData = { ...activity };
    this.isActivityEditModalOpen = true;
    this.successMessage = '';
  }

  updateActivity(): void {
    if (!this.editActivityData.name.trim()) {
      this.showError('Bitte gib einen Namen für die Aktivität ein.');
      return;
    }

    if (!this.editActivityData.location) {
      this.showError('Bitte wähle eine Reise aus.');
      return;
    }

    if (!this.editActivityData.date) {
      this.showError('Bitte gib ein Datum für die Aktivität ein.');
      return;
    }

    if (!this.editActivityData.category) {
      this.showError('Bitte wähle eine Kategorie aus.');
      return;
    }

    const selectedTrip = this.trips.find(
      trip => trip.destination === this.editActivityData.location
    );

    if (
      selectedTrip &&
      (this.editActivityData.date < selectedTrip.startDate ||
        this.editActivityData.date > selectedTrip.endDate)
    ) {
      this.showError(
        'Das Aktivitätsdatum muss innerhalb des Reisezeitraums liegen.'
      );
      return;
    }

    if (this.editingActivityIndex === null) {
      return;
    }

    this.activities[this.editingActivityIndex] = {
      ...this.editActivityData
    };

    this.closeActivityModal();
    this.showSuccess('Aktivität wurde aktualisiert.');
  }

  closeActivityModal(): void {
    this.isActivityEditModalOpen = false;
    this.editingActivityIndex = null;
  }


  editTrip(
    trip: {
      destination: string;
      startDate: string;
      endDate: string;
      status: string;
    },
    index: number
  ): void {
    this.editingIndex = index;
    this.editTripData = { ...trip };
    this.isEditModalOpen = true;
    this.successMessage = '';
  }

  updateTrip(): void {
    if (!this.editTripData.destination.trim()) {
      this.showError('Bitte gib ein Reiseziel ein.');
      return;
    }

    if (!this.editTripData.startDate || !this.editTripData.endDate) {
      this.showError('Bitte gib ein Start- und Enddatum ein.');
      return;
    }

    if (!this.isDateRangeValid(this.editTripData.startDate, this.editTripData.endDate)) {
      return;
    }

    if (this.editingIndex === null) {
      return;
    }

    this.trips[this.editingIndex] = { ...this.editTripData };
    this.closeEditModal();
    this.showSuccess('Reise wurde aktualisiert.');
  }

  deleteTrip(index: number): void {
    const confirmed = window.confirm('Möchtest du diese Reise wirklich löschen?');

    if (!confirmed) {
      return;
    }

    this.trips.splice(index, 1);
    this.showSuccess('Reise wurde gelöscht.');
  }

  deleteActivity(index: number): void {
    const confirmed = window.confirm(
      'Möchtest du diese Aktivität wirklich löschen?'
    );

    if (!confirmed) {
      return;
    }

    this.activities.splice(index, 1);
    this.showSuccess('Aktivität wurde gelöscht.');
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.editingIndex = null;
  }

  private isDateRangeValid(startDate: string, endDate: string): boolean {
    if (startDate < this.today) {
      this.showError('Das Startdatum darf nicht in der Vergangenheit liegen.');
      return false;
    }

    if (endDate < startDate) {
      this.showError('Das Enddatum darf nicht vor dem Startdatum liegen.');
      return false;
    }

    return true;
  }

  private showError(message: string): void {
    this.messageType = 'error';
    this.successMessage = message;
  }

  private showSuccess(message: string): void {
    this.messageType = 'success';
    this.successMessage = message;
  }
}
