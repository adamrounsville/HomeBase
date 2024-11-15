from pydantic import BaseModel

class LatLon(BaseModel):
    latitude: float
    longitude: float
