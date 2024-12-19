import { Title } from "@radix-ui/react-dialog";
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
  color: string;

  constructor(id: string, title: string, activities: Place[] = [], color:string) {
      this.id = id;
      this.title = title;
      this.activities = activities;
      this.color = color;
  }

  // Method to add a place to the activity group
  addActivity(place: Place): void {
      this.activities.push(place);
  }
}

export class Vacation{
  id: string;
  title: string;
  dates: Trip[]

  constructor(id: string, title: string, dates: Trip[]){
    this.id= id
    this.title = title
    this.dates = dates
  }
}
export class Trip{
  id: string;
  date: string;
  places: Place[]

  constructor(id: string, date:string, places: Place[]){
    this.id = id
    this.date = date
    this.places = places
  }
}
