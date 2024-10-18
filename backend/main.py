from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel

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


app = FastAPI()


@app.get("/place/add")
def get_place():
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
def get_homebase():
    """
        Takes in a address from the frontend, sets the information for use in the backend? or
        send info for focusing the map in the frontend
    """
    pass
