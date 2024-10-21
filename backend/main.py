from typing import Union, Annotated
import os
from dotenv import load_dotenv
from fastapi import FastAPI, Body
from pydantic import BaseModel
import googlemaps

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

data = InfoManagerDict()

gmaps = googlemaps.Client(key=os.getenv("GOOGLE_MAPS_API_KEY"))

app = FastAPI()

@app.get("/place/add")
def add_place():
    """
        Takes in a location name from the frontend, returns a Place made with information from
        Google API
    """
    pass
    # return {"Hello": "World"}

@app.get("/place/get")
def get_place():
    """
        Takes in a location name from the frontend, returns a Place made with information from
        Google API
    """
    pass

@app.get("/route")
def get_route():
    """
        Takes in a list of latitiudes and longitudes from the frontend, returns a Route made with information 
        from Google API (format pending)
    """
    pass


@app.get("/homebase")
async def get_homebase(address: Annotated[str, Body()]):
    """
        Takes in a address from the frontend, sets the information for use in the backend
        Returns the UUID.
    """
    geocode_result = gmaps.geocode(address)

    lat = geocode_result[0]['geometry']['location']['lat']
    lng = geocode_result[0]['geometry']['location']['lng']

    uuid = data.add_user(lat, lng)

    return { "uuid": uuid }
