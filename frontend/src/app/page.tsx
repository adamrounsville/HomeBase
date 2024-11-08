"use client";
import styles from "./page.module.css";
import GoogleMapComponent from "./components/map";
import SearchBar from "./components/search";
import NavBar from "./components/navbar";
import ActivitySelector from "./components/activitySelector";
import Homebase from "./components/homebase";
import { useEffect, useRef, useState } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { ActivityGroup, Place } from "@/lib/utils";
import DailyActivities from "./components/dailyActivities";

export default function Home() {
  const [homebaseLocation, setHomebaseLocation] = useState<Place | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [activityGroups, setActivityGroups] = useState<ActivityGroup[]>([]);

  const [dailyPlans, setDailyPlans] = useState<
    Record<"Day 1" | "Day 2" | "Day 3", Place[]>
  >({
    "Day 1": [],
    "Day 2": [],
    "Day 3": [],
  });

  const addToDailyPlan = (
    activity: Place,
    selectedDate: "Day 1" | "Day 2" | "Day 3"
  ) => {
    if (
      !dailyPlans[selectedDate].some((a) => a.placeId === activity.placeId)
    ) {
      setDailyPlans((prevDailyPlans) => ({
        ...prevDailyPlans,
        [selectedDate]: [...prevDailyPlans[selectedDate], activity],
      }));
    }
  };

  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<number | null>(100);
  const [focusHomebase, setFocusHomebase] = useState(false);
  const [focusSelectedLocation, setFocusSelectedLocation] = useState<Place | undefined>();

  const prevHomebaseLocation = useRef(homebaseLocation);
  const prevSelectedPlace = useRef(selectedPlace);
  const prevSelectedActivity = useRef(selectedActivity);

  useEffect(() => {
    if (localStorage.getItem('homebasePositionLng') && localStorage.getItem('homebasePositionLat')) {
      const name = localStorage?.getItem('homebaseName');
      const location = localStorage.getItem('homebaseLocation');
      const placeId = localStorage?.getItem('homebaseID');
      const lat = parseFloat(localStorage?.getItem('homebasePositionLat')!);
      const lng = parseFloat(localStorage?.getItem('homebasePositionLng')!);
      const viewportStr = localStorage?.getItem('homebaseViewport')!
      const viewportObj = JSON.parse(viewportStr)
      const place = new Place(name!, location!, placeId!, lat, lng, viewportObj)
      setHomebaseLocation(place)
    }
  }, []);

  useEffect(() => {
    if (homebaseLocation !== prevHomebaseLocation.current) {
      setFocusSelectedLocation(homebaseLocation!);
    } else if (selectedPlace !== prevSelectedPlace.current) {
      setFocusSelectedLocation(selectedPlace!);
    }
    else if (selectedActivity !== prevSelectedActivity.current) {
      const selectedGroup = activityGroups.find((group) => group.id === openGroup);
      const activity = selectedGroup?.activities.at(selectedActivity!)
      if (activity) {
        setFocusSelectedLocation(activity);
        setSelectedActivity(20);
      }
    }
    else if (focusHomebase) {
      setFocusSelectedLocation(homebaseLocation!)
      setFocusHomebase(false);
    }
    // Update refs to current values for next comparison
    prevHomebaseLocation.current = homebaseLocation;
    prevSelectedPlace.current = selectedPlace;
    prevSelectedActivity.current = selectedActivity;
  }), [homebaseLocation, selectedPlace, selectedActivity, focusHomebase]

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
                  setFocusHomebase={setFocusHomebase}
                  onHomebaseSelect={setHomebaseLocation}
                />
                <SearchBar onPlaceSelect={setSelectedPlace} />
              </header>

              <aside className="sidebar">
                <ActivitySelector
                  activityGroups={activityGroups}
                  selectedActivity={selectedActivity}
                  setActivityGroups={setActivityGroups}
                  addToDailyPlan={(activity) =>
                    addToDailyPlan(activity, "Day 1")
                  }
                  // Example for Day 1
                  openGroup={openGroup}
                  setOpenGroup={setOpenGroup}
                  setSelectedActivity={setSelectedActivity}
                />
              </aside>

              <section className="map">
                <GoogleMapComponent
                  selectedPlace={selectedPlace}
                  homebaseLocation={homebaseLocation}
                  openGroup={openGroup}
                  activityGroups={activityGroups}
                  focusSelectedLocation={focusSelectedLocation}
                  setActivityGroups={setActivityGroups}
                  setSelectedActivity={setSelectedActivity}
                />
              </section>

              <section className="schedule">
                <h3>Daily Schedule</h3>
                <DailyActivities
                  dailyPlans={dailyPlans}
                  setDailyPlans={setDailyPlans}
                  activityGroups={activityGroups}
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
