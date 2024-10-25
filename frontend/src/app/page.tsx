"use client"
import styles from "./page.module.css";
import GoogleMapComponent from "./components/map";
import SearchBar from "./components/search";
import NavBar from "./components/navbar";
import ActivitySelector from "./components/activitySelector";
import Homebase from "./components/homebase";
import { useState } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { ActivityGroup } from "@/lib/utils";

export default function Home() {

  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [activityGroups, setActivityGroups] = useState([
    new ActivityGroup("group-id-1", "Snorkelling", []),
    new ActivityGroup("group-id-2", "Beaches", []),
    new ActivityGroup("group-id-3", "Resturants", []),
  ]);
  
  return (
    <div>
      <NavBar/>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <div className={styles.page}>
          
          <main className= {styles.main}>

            <div className="container">

              <header className="header">
                <Homebase onPlaceSelect={setSelectedPlace}/>
                <SearchBar onPlaceSelect={setSelectedPlace}/>
              </header>
            
              <aside className="sidebar">
                <ActivitySelector activityGroups={activityGroups} setActivityGroups={setActivityGroups}/>
              </aside>

              <section className="map">
                <GoogleMapComponent selectedPlace={selectedPlace} activityGroups={activityGroups} setActivityGroups={setActivityGroups}/>
              </section>

              <section className="schedule">
                <h3>Daily Schedule: Oct. 2, 2024</h3>
                <ul>
                  <li>Location 1</li>
                  <li>Location 2</li>
                  <li>Location 3</li>
                </ul>
              </section>
            </div>

          </main>    
          <footer className={styles.footer}>
            
          </footer>
        </div>
      </APIProvider>

    </div>
    
  );
}
