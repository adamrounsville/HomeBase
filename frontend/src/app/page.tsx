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
import RouteOptimization from "./components/routeOptimization";

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

  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<{id: string, index: number}| null>({id:"RANDID", index:20});
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
      const selectedGroup = activityGroups.find((group) => group.id === selectedActivity?.id);

      const activity = selectedGroup?.activities.at(selectedActivity?.index!)
      if (activity) {
        setFocusSelectedLocation(activity);
        setSelectedActivity({id: "PAGE_ID", index:20});
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
    <div className="bg-white">
      <NavBar />
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <div className= "main">
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
                  openGroup={openGroups}
                  setOpenGroup={setOpenGroups}
                  setSelectedActivity={setSelectedActivity}
                />
              </aside>

              <section className="map">
                <GoogleMapComponent
                  selectedPlace={selectedPlace}
                  homebaseLocation={homebaseLocation}
                  openGroup={openGroups}
                  activityGroups={activityGroups}
                  focusSelectedLocation={focusSelectedLocation}
                  setActivityGroups={setActivityGroups}
                  setSelectedActivity={setSelectedActivity}
                />
              </section>

              <section className="schedule flex">
                  <div className="flex-1">
                    <DailyActivities
                      dailyPlans={dailyPlans}
                      setDailyPlans={setDailyPlans}
                      activityGroups={activityGroups}
                    />
                  </div>
                  <div className=" schedule-optimization flex-2">
                    <RouteOptimization/>
                  </div>
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
