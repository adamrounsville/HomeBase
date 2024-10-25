import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export class Place {
  Name: string | undefined;
  Address: string | undefined;
  Place_ID: string | undefined;
  Latitude: number | undefined;
  Longitude: number | undefined;

  constructor(name: string | undefined, address: string | undefined, placeId: string | undefined, latitude: number | undefined, longitude: number |undefined) {
      this.Name = name;
      this.Address = address;
      this.Place_ID = placeId;
      this.Latitude = latitude;
      this.Longitude = longitude;
  }

  // Method to display information about the place
  displayPlaceInfo(): string {
      return `Place: ${this.Name}\nAddress: ${this.Address}\nPlace ID: ${this.Place_ID}\nLocation: (${this.Latitude}, ${this.Longitude})`;
  }
}

export class ActivityGroup {
  id: string;
  title: string;
  activities: Place[];

  constructor(id: string, title: string, activities: Place[] = []) {
      this.id = id;
      this.title = title;
      this.activities = activities;
  }

  // Method to add a place to the activity group
  addActivity(place: Place): void {
      this.activities.push(place);
  }
}
