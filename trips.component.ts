import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-trips',
  imports: [RouterLink, FormsModule],
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.scss'
})
export class TripsComponent implements OnInit {
  trips: any[] = [];
  activities: any[] = [];

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

  constructor(
    private location: Location,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.apiService.getTrips().subscribe({
      next: (trips) => {
        this.trips = trips;
      },
      error: () => {
        this.showError('Reisen konnten nicht geladen werden.');
      }
    });

    this.apiService.getActivities().subscribe({
      next: (activities) => {
        this.activities = activities;
      },
      error: () => {
        this.showError('Aktivitäten konnten nicht geladen werden.');
      }
    });
  }

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

    if (
      !this.isDateRangeValid(
        this.newTrip.startDate,
        this.newTrip.endDate
      )
    ) {
      return;
    }

    this.apiService.createTrip(this.newTrip).subscribe({
      next: (createdTrip) => {
        this.trips.push(createdTrip);
        this.showSuccess('Reise wurde hinzugefügt.');

        this.newTrip = {
          destination: '',
          startDate: '',
          endDate: '',
          status: 'Geplant'
        };
      },
      error: (error) => {
        this.showError(
          error.error?.message ||
          'Reise konnte nicht gespeichert werden.'
        );
      }
    });
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
      (
        this.newActivity.date < selectedTrip.startDate ||
        this.newActivity.date > selectedTrip.endDate
      )
    ) {
      this.showError(
        'Das Aktivitätsdatum muss innerhalb des Reisezeitraums liegen.'
      );
      return;
    }

    this.apiService.createActivity(this.newActivity).subscribe({
      next: (createdActivity) => {
        this.activities.push(createdActivity);
        this.showSuccess('Aktivität wurde hinzugefügt.');

        this.newActivity = {
          name: '',
          location: '',
          date: '',
          category: '',
          status: 'Geplant'
        };
      },
      error: (error) => {
        this.showError(
          error.error?.message ||
          'Aktivität konnte nicht gespeichert werden.'
        );
      }
    });
  }

  editActivity(
    activity: any,
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
      (
        this.editActivityData.date < selectedTrip.startDate ||
        this.editActivityData.date > selectedTrip.endDate
      )
    ) {
      this.showError(
        'Das Aktivitätsdatum muss innerhalb des Reisezeitraums liegen.'
      );
      return;
    }

    if (this.editingActivityIndex === null) {
      return;
    }

    const activityId =
      this.activities[this.editingActivityIndex].id;

    this.apiService.updateActivity(
      activityId,
      this.editActivityData
    ).subscribe({
      next: (updatedActivity) => {
        this.activities[this.editingActivityIndex!] = updatedActivity;
        this.closeActivityModal();
        this.showSuccess('Aktivität wurde aktualisiert.');
      },
      error: (error) => {
        this.showError(
          error.error?.message ||
          'Aktivität konnte nicht aktualisiert werden.'
        );
      }
    });
  }

  closeActivityModal(): void {
    this.isActivityEditModalOpen = false;
    this.editingActivityIndex = null;
  }

  editTrip(
    trip: any,
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

    if (
      !this.isDateRangeValid(
        this.editTripData.startDate,
        this.editTripData.endDate
      )
    ) {
      return;
    }

    if (this.editingIndex === null) {
      return;
    }

    const tripId = this.trips[this.editingIndex].id;

    this.apiService.updateTrip(
      tripId,
      this.editTripData
    ).subscribe({
      next: (updatedTrip) => {
        this.trips[this.editingIndex!] = updatedTrip;
        this.closeEditModal();
        this.showSuccess('Reise wurde aktualisiert.');
      },
      error: (error) => {
        this.showError(
          error.error?.message ||
          'Reise konnte nicht aktualisiert werden.'
        );
      }
    });
  }

  deleteTrip(index: number): void {
    const confirmed = window.confirm(
      'Möchtest du diese Reise wirklich löschen?'
    );

    if (!confirmed) {
      return;
    }

    const tripId = this.trips[index].id;

    this.apiService.deleteTrip(tripId).subscribe({
      next: () => {
        this.trips.splice(index, 1);
        this.showSuccess('Reise wurde gelöscht.');
      },
      error: (error) => {
        this.showError(
          error.error?.message ||
          'Reise konnte nicht gelöscht werden.'
        );
      }
    });
  }

  deleteActivity(index: number): void {
    const confirmed = window.confirm(
      'Möchtest du diese Aktivität wirklich löschen?'
    );

    if (!confirmed) {
      return;
    }

    const activityId = this.activities[index].id;

    this.apiService.deleteActivity(activityId).subscribe({
      next: () => {
        this.activities.splice(index, 1);
        this.showSuccess('Aktivität wurde gelöscht.');
      },
      error: (error) => {
        this.showError(
          error.error?.message ||
          'Aktivität konnte nicht gelöscht werden.'
        );
      }
    });
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.editingIndex = null;
  }

  private isDateRangeValid(
    startDate: string,
    endDate: string
  ): boolean {
    if (startDate < this.today) {
      this.showError(
        'Das Startdatum darf nicht in der Vergangenheit liegen.'
      );
      return false;
    }

    if (endDate < startDate) {
      this.showError(
        'Das Enddatum darf nicht vor dem Startdatum liegen.'
      );
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
