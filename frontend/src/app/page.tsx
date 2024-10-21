import styles from "./page.module.css";
import GoogleMapComponent from "./components/map";
import SearchBar from "./components/search";
import NavBar from "./components/navbar";
import ActivitySelector from "./components/activitySelector";
import Homebase from "./components/homebase";

export default function Home() {
  return (
    <div>
      <NavBar/>
      <div className={styles.page}>
        
        <main className= {styles.main}>

          <div className="container">

            <header className="header">
              <Homebase/>
              <SearchBar/>
            </header>
          
            <aside className="sidebar">
              <ActivitySelector/>
            </aside>

            <section className="map">
              <GoogleMapComponent/>
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

    </div>
    
  );
}
