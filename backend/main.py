from typing import Union, Annotated
import os
from dotenv import load_dotenv
from fastapi import FastAPI, Body, HTTPException
from pydantic import BaseModel
import googlemaps
from contextlib import asynccontextmanager

from info_manager_dict import InfoManagerDict

class Place(BaseModel):
    name: str
    ID: str
    latitude: float
    longitude: float

class LatLon(BaseModel):
    latitude: float
    longitude: float

class Route(BaseModel):
    # TODO
    pass

load_dotenv()

db = InfoManagerDict()
gmaps = googlemaps.Client(key=os.getenv("GOOGLE_MAPS_API_KEY"))
app = FastAPI()

@app.post("/place/add")
def add_place(user_id: Annotated[str, Body()], place_name: Annotated[str, Body()], activity_group: Annotated[str, Body()]):
    """
    Takes in a user ID,location name, and activity group from the frontend, adds a Place made with information from
    the Google Places API to the user's places, and returns the Place object.
    """
    try:
        user = db.get_user(user_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not db.activity_group_exists(user_id, activity_group):
        raise HTTPException(status_code=404, detail="Activity group not found")

    # Bias results within 100km of the user's homebase
    place_result = gmaps.places(place_name, user.home, radius=100000)
    if not place_result['results']:
        raise HTTPException(status_code=404, detail="Place not found")

    place_info = place_result['results'][0]

    place_id = place_info['place_id']
    name = place_info['name']
    location = place_info['geometry']['location']
    latitude = location['lat']
    longitude = location['lng']

    db.add_place(activity_group, user_id, name, place_id, latitude, longitude)

    return { "place": Place(name=name, ID=place_id, latitude=latitude, longitude=longitude) }

@app.get("/place/get")
def get_place(user_id: str, place_name: str):
    """
    Takes in a user ID and a location name from the frontend, returns a Place object with information from the user's places
    """
    if user_id not in db.data:
        raise HTTPException(status_code=404, detail="User not found")

    user_places = db.get_places(user_id)

    place = next((p for p in user_places if p.name.lower() == place_name.lower()), None)
    if not place:
        raise HTTPException(status_code=404, detail="Place not found for this user")

    return { "place": place }

@app.delete("/place/delete")
def delete_place(user_id: Annotated[str, Body()], activity_group: Annotated[str, Body()], place_id: Annotated[str, Body()]):
    """
    Takes in a user ID and a location name from the frontend, deletes the place from the user's places
    """
    if user_id not in db.data:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not db.activity_group_exists(user_id, activity_group):
        raise HTTPException(status_code=404, detail="Activity group not found")
    
    db.delete_place(user_id, activity_group, place_id)

    return { "message" : "success" }

@app.post("/activity-group/add")
def add_activity_group(user_id: Annotated[str, Body()], activity_group: Annotated[str, Body()]):
    """
    Takes in a user ID and an activity group name from the frontend, adds the activity group to the user's places
    """
    if user_id not in db.data:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.add_activity_group(user_id, activity_group)

    return { "message" : "success" }

@app.get("/activity-group/get")
def get_activity_group(user_id: Annotated[str, Body()], activity_group: Annotated[str, Body()]):
    """
    Takes in a user ID and an activity group name from the frontend, returns the activity group from the user's places
    """
    if user_id not in db.data:
        raise HTTPException(status_code=404, detail="User not found")
    
    places = db.get_activity_group(user_id, activity_group)

    return { "places" : places }

@app.post("/activity-group/delete")
def delete_activity_group(user_id: Annotated[str, Body()], activity_group: Annotated[str, Body()]):
    """
    Takes in a user ID and an activity group name from the frontend, deletes the activity group from the user's places
    """
    if user_id not in db.data:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete_activity_group(user_id, activity_group)

    return { "message" : "success" }

@app.post("/homebase")
def set_homebase(address: Annotated[str, Body()]):
    """
    Takes in a address from the frontend, sets the information for use in the backend, and 
    returns the UUID associated with the user.
    """
    geocode_result = gmaps.geocode(address)

    lat = geocode_result[0]['geometry']['location']['lat']
    lng = geocode_result[0]['geometry']['location']['lng']
    
    uuid = db.add_user(lat, lng)

    return { "uuid": uuid }

@app.get("/route")
def get_route():
    """
    Takes in a list of latitiudes and longitudes from the frontend, returns a Route made with information 
    from Google API (format pending)
    """
    pass
