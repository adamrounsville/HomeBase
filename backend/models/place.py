from pydantic import BaseModel

class Place(BaseModel):
    name: str
    ID: str
    latitude: float
    longitude: float
