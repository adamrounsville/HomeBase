"use client";
import styles from "./page.module.css";
import GoogleMapComponent from "./components/map";
import SearchBar from "./components/search";
import NavBar from "./components/navbar";
import ActivitySelector from "./components/activitySelector";
import Homebase from "./components/homebase";
import { useState } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { ActivityGroup, Place } from "@/lib/utils";
import DailyActivities from "./components/dailyActivities";

export default function Home() {
  const [homebaseLocation, setHomebaseLocation] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [activityGroups, setActivityGroups] = useState([
    new ActivityGroup("group-id-1", "Snorkelling", []),
    new ActivityGroup("group-id-2", "Beaches", []),
    new ActivityGroup("group-id-3", "Resturants", []),
  ]);

  const [dailyPlan, setDailyPlan] = useState<Place[]>([]);

  const addToDailyPlan = (activity: Place) => {
    if (!dailyPlan.some((a) => a.Place_ID === activity.Place_ID)) {
      setDailyPlan((prevDailyPlan) => [...prevDailyPlan, activity]);
    }
  };

  return (
    <div>
      <NavBar />
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <div className={styles.page}>
          <main className={styles.main}>
            <div className="container">
              <header className="header">
                <Homebase
                  homebaseLocation={homebaseLocation}
                  onHomebaseSelect={setHomebaseLocation}
                />
                <SearchBar onPlaceSelect={setSelectedPlace} />
              </header>

              <aside className="sidebar">
                <ActivitySelector
                  activityGroups={activityGroups}
                  setActivityGroups={setActivityGroups}
                  addToDailyPlan={addToDailyPlan} // Pass the function
                />
              </aside>

              <section className="map">
                <GoogleMapComponent
                  selectedPlace={selectedPlace}
                  homebaseLocation={homebaseLocation}
                  activityGroups={activityGroups}
                  setActivityGroups={setActivityGroups}
                />
              </section>

              <section className="schedule">
                <h3>Daily Schedule</h3>
                <DailyActivities
                  dailyPlan={dailyPlan}
                  setDailyPlan={setDailyPlan}
                />
              </section>
            </div>
          </main>
          <footer className={styles.footer}></footer>
        </div>
      </APIProvider>
    </div>
  );
}
