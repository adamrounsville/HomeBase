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
    new ActivityGroup("group-id-3", "Restaurants", []),
  ]);

  // Update this state to hold plans for multiple days
  const [dailyPlans, setDailyPlans] = useState<
    Record<"Day 1" | "Day 2" | "Day 3", Place[]>
  >({
    "Day 1": [],
    "Day 2": [],
    "Day 3": [],
  });

  // Function to add activity to a specific day's plan
  const addToDailyPlan = (
    activity: Place,
    selectedDate: "Day 1" | "Day 2" | "Day 3"
  ) => {
    if (
      !dailyPlans[selectedDate].some((a) => a.Place_ID === activity.Place_ID)
    ) {
      setDailyPlans((prevDailyPlans) => ({
        ...prevDailyPlans,
        [selectedDate]: [...prevDailyPlans[selectedDate], activity],
      }));
    }
  };

  const [openGroup, setOpenGroup] = useState<string | null>(null);

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
                  addToDailyPlan={(activity) =>
                    addToDailyPlan(activity, "Day 1")
                  }
                  // Example for Day 1
                  openGroup={openGroup}
                  setOpenGroup={setOpenGroup}
                />
              </aside>

              <section className="map">
                <GoogleMapComponent
                  selectedPlace={selectedPlace}
                  homebaseLocation={homebaseLocation}
                  openGroup={openGroup}
                  activityGroups={activityGroups}
                  setActivityGroups={setActivityGroups}
                  setOpenGroup={setOpenGroup}
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

// "use client";
// import styles from "./page.module.css";
// import GoogleMapComponent from "./components/map";
// import SearchBar from "./components/search";
// import NavBar from "./components/navbar";
// import ActivitySelector from "./components/activitySelector";
// import Homebase from "./components/homebase";
// import { useState } from "react";
// import { APIProvider } from "@vis.gl/react-google-maps";
// import { ActivityGroup, Place } from "@/lib/utils";
// import DailyActivities from "./components/dailyActivities";

// export default function Home() {
//   const [homebaseLocation, setHomebaseLocation] =
//     useState<google.maps.places.PlaceResult | null>(null);
//   const [selectedPlace, setSelectedPlace] =
//     useState<google.maps.places.PlaceResult | null>(null);
//   const [activityGroups, setActivityGroups] = useState([
//     new ActivityGroup("group-id-1", "Snorkelling", []),
//     new ActivityGroup("group-id-2", "Beaches", []),
//     new ActivityGroup("group-id-3", "Resturants", []),
//   ]);

//   const [dailyPlan, setDailyPlan] = useState<Place[]>([]);

//   const addToDailyPlan = (activity: Place) => {
//     if (!dailyPlan.some((a) => a.Place_ID === activity.Place_ID)) {
//       setDailyPlan((prevDailyPlan) => [...prevDailyPlan, activity]);
//     }
//   };

//   return (
//     <div>
//       <NavBar />
//       <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
//         <div className={styles.page}>
//           <main className={styles.main}>
//             <div className="container">
//               <header className="header">
//                 <Homebase
//                   homebaseLocation={homebaseLocation}
//                   onHomebaseSelect={setHomebaseLocation}
//                 />
//                 <SearchBar onPlaceSelect={setSelectedPlace} />
//               </header>

//               <aside className="sidebar">
//                 <ActivitySelector
//                   activityGroups={activityGroups}
//                   setActivityGroups={setActivityGroups}
//                   addToDailyPlan={addToDailyPlan} // Pass the function
//                 />
//               </aside>

//               <section className="map">
//                 <GoogleMapComponent
//                   selectedPlace={selectedPlace}
//                   homebaseLocation={homebaseLocation}
//                   activityGroups={activityGroups}
//                   setActivityGroups={setActivityGroups}
//                 />
//               </section>

//               <section className="schedule">
//                 <h3>Daily Schedule</h3>
//                 <DailyActivities
//                   dailyPlan={dailyPlan}
//                   setDailyPlan={setDailyPlan}
//                   activityGroups={activityGroups}
//                 />
//               </section>
//             </div>
//           </main>
//           <footer className={styles.footer}></footer>
//         </div>
//       </APIProvider>
//     </div>
//   );
// }
