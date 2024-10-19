import dataclasses

@dataclasses.dataclass
class Place:
    name: str
    ID: str
    latitude: float
    longitude: float

@dataclasses.dataclass
class UserInfo:
    home: str
    places: list[Place]

class InfoManagerDict:

    def __init__(self):
        self.data = dict()

    def add_user(self, location):
        user_id = str(len(self.data))
        info: UserInfo
        info.home = location
        self.data[user_id] = info
        return user_id
    
    def add_place(self, user_id: str, name: str, id: str, latitude: float, longitude: float):
        self.data[user_id].places.append(Place(name, id, latitude, longitude))

    def get_places(self, user_id: str):
        return self.data[user_id].places
