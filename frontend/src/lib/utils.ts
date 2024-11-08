import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export class Place {
  name: string | undefined;
  address: string | undefined;
  placeId: string | undefined;
  latitude: number | undefined;
  longitude: number | undefined;
  viewport: any;

  constructor(name: string | undefined, address: string | undefined, placeId: string | undefined, latitude: number | undefined, longitude: number |undefined, viewport:any) {
      this.name = name;
      this.address = address;
      this.placeId = placeId;
      this.latitude = latitude;
      this.longitude = longitude;
      this.viewport = viewport
  }

  // Method to display information about the place
  displayPlaceInfo(): string {
      return `Place: ${this.name}\nAddress: ${this.address}\nPlace ID: ${this.placeId}\nLocation: (${this.latitude}, ${this.longitude})`;
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
