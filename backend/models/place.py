from pydantic import BaseModel
from typing import Any

class Place(BaseModel):
    name: str
    ID: str
    address:str
    latitude: float
    longitude: float
    viewport :Any
