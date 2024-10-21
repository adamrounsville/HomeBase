import dataclasses
import uuid

@dataclasses.dataclass
class Place:
    name: str
    ID: str
    latitude: float
    longitude: float

@dataclasses.dataclass
class UserInfo:
    home: tuple[float, float]
    places: list[Place]

class InfoManagerDict:
    def __init__(self):
        self.data = dict()

    def add_user(self, latitude, longitude):
        user_id = uuid.uuid4()
        info = UserInfo(home=(latitude, longitude), places=[])
        self.data[user_id] = info
        return user_id
    
    def add_place(self, user_id: str, name: str, id: str, latitude: float, longitude: float):
        self.data[user_id].places.append(Place(name, id, latitude, longitude))

    def get_places(self, user_id: str):
        return self.data[user_id].places
