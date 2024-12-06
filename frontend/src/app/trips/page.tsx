"use client"
import { APIProvider } from "@vis.gl/react-google-maps";
import NavBar from "../components/homebase/navbar";
import styles from "../page.module.css"
import TripSelector from "../components/trips/tripSelector";
import { useState } from "react";
import { Place, Trip, Vacation } from "@/lib/utils";
import TripGoogleMaps from "../components/trips/tripGoogleMaps";

export default function Trips() {
    const place1 = new Place(
        "Eiffel Tower",
        "Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France",
        "ChIJD7fiBh9u5kcRYJ0pP3lF2pE",
        48.8584,
        2.2945,
        { north: 48.859, south: 48.858, east: 2.295, west: 2.294 }
      );
      
      const place2 = new Place(
        "Statue of Liberty",
        "New York, NY 10004, USA",
        "ChIJaXH9R6kFzEwRmGdhJb-8AQU",
        40.6892,
        -74.0445,
        { north: 40.690, south: 40.689, east: -74.043, west: -74.045 }
      );

      // Example places
    const place3 = new Place(
        "Colosseum",
        "Piazza del Colosseo, 1, 00100 Roma RM, Italy",
        "ChIJo3eJpX1z0R0RweFbfi3O5Ak",
        41.8902,
        12.4922,
        { north: 41.891, south: 41.889, east: 12.493, west: 12.491 }
    );
    
    const place4 = new Place(
        "Great Wall of China",
        "Huairou, China",
        "ChIJP0P0d-9x1j8R6lFv5vXY7k8",
        40.4319,
        116.5704,
        { north: 40.432, south: 40.431, east: 116.571, west: 116.570 }
    );
    const trip1 = new Trip("t1", "2024-05-01", [place1, place2]);

    const trip2 = new Trip("t2", "2024-06-01", [place3, place4]);

    const vacation = new Vacation("v1", "European & American Tour ", [trip1, trip2]);

    const [vacations, setVacations] = useState<Vacation[]>([vacation])
    const [openVacation, setOpenVacation] = useState<string>("")
    const [selectedTrip, setSelectedTrip] = useState<Trip>()

    return (
      <div>
        <NavBar />
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <div className= "main">
          <main className={styles.main}>
            <div className="container">
                <aside className="sidebar">
                    <TripSelector
                        vacations={vacations}
                        openVacation={openVacation}
                        setOpenVacation={setOpenVacation}
                        setSelectedTrip={setSelectedTrip}
                    />
              </aside>
              <section className="trip-map-container">
                <TripGoogleMaps 
                trip={selectedTrip}
                />
              </section>
            </div>
        </main>
        </div>
        </APIProvider>
        <footer className="w-full bg-black text-white text-center py-1">
            <p className="text-sm">
            Homebase &copy; 2024
            </p>
        </footer>
      </div>
    );
  }