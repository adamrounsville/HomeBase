import unittest
from info_manager_dict import InfoManagerDict, Place

class TestInfoManagerDict(unittest.TestCase):
    def setUp(self):
        self.manager = InfoManagerDict()

    def test_add_user(self):
        user_id = self.manager.add_user(40.7128, -74.0060)
        self.assertIn(user_id, self.manager.data)
        self.assertEqual(self.manager.data[user_id].home, (40.7128, -74.0060))
        self.assertEqual(len(self.manager.data[user_id].places), 0)

    def test_add_place(self):
        user_id = self.manager.add_user(40.7128, -74.0060)
        self.manager.add_activity_group(user_id, "parks")
        self.manager.add_place("parks", user_id, "Central Park", "park1", 40.7829, -73.9654)
        
        places = self.manager.get_places(user_id)
        self.assertEqual(len(places), 1)
        self.assertEqual(places[0].name, "Central Park")
        self.assertEqual(places[0].ID, "park1")
        self.assertEqual(places[0].latitude, 40.7829)
        self.assertEqual(places[0].longitude, -73.9654)

    def test_get_places(self):
        user_id = self.manager.add_user(40.7128, -74.0060)
        self.manager.add_activity_group(user_id, "parks")
        self.manager.add_activity_group(user_id, "squares")
        
        self.manager.add_place("parks", user_id, "Central Park", "park1", 40.7829, -73.9654)
        self.manager.add_place("squares", user_id, "Times Square", "square1", 40.7580, -73.9855)

        places = self.manager.get_places(user_id)
        self.assertEqual(len(places), 2)
        self.assertEqual(places[0].name, "Central Park")
        self.assertEqual(places[1].name, "Times Square")

    def test_multiple_users(self):
        user1 = self.manager.add_user(40.7128, -74.0060)
        user2 = self.manager.add_user(34.0522, -118.2437)

        self.assertNotEqual(user1, user2)
        self.assertEqual(len(self.manager.data), 2)

        self.manager.add_activity_group(user1, "parks")
        self.manager.add_activity_group(user2, "landmarks")

        self.manager.add_place("parks", user1, "Central Park", "park1", 40.7829, -73.9654)
        self.manager.add_place("landmarks", user2, "Hollywood Sign", "sign1", 34.1341, -118.3215)

        places1 = self.manager.get_places(user1)
        places2 = self.manager.get_places(user2)

        self.assertEqual(len(places1), 1)
        self.assertEqual(len(places2), 1)
        self.assertEqual(places1[0].name, "Central Park")
        self.assertEqual(places2[0].name, "Hollywood Sign")

    def test_activity_group_exists(self):
        user_id = self.manager.add_user(40.7128, -74.0060)
        self.manager.add_activity_group(user_id, "parks")

        self.assertTrue(self.manager.activity_group_exists(user_id, "parks"))
        self.assertFalse(self.manager.activity_group_exists(user_id, "squares"))

    def test_delete_place(self):
        user_id = self.manager.add_user(40.7128, -74.0060)
        self.manager.add_activity_group(user_id, "parks")
        self.manager.add_place("parks", user_id, "Central Park", "park1", 40.7829, -73.9654)
        
        self.manager.delete_place(user_id, "parks", "park1")
        places = self.manager.get_places(user_id)
        self.assertEqual(len(places), 0)

    def test_delete_activity_group(self):
        user_id = self.manager.add_user(40.7128, -74.0060)
        self.manager.add_activity_group(user_id, "parks")
        self.manager.add_activity_group(user_id, "squares")

        self.manager.delete_activity_group(user_id, "parks")
        self.assertFalse(self.manager.activity_group_exists(user_id, "parks"))
        self.assertTrue(self.manager.activity_group_exists(user_id, "squares"))

    def test_add_to_daily_plan(self):
        user_id = self.manager.add_user(40.7128, -74.0060)
        self.manager.add_activity_group(user_id, "parks")
        self.manager.add_place("parks", user_id, "Central Park", "park1", 40.7829, -73.9654)

        self.manager.add_to_daily_plan(user_id, "morning", "park1")
        places_in_plan = self.manager.get_daily_plan(user_id, "morning")
        
        self.assertEqual(len(places_in_plan), 1)
        self.assertEqual(places_in_plan[0].name, "Central Park")
        self.assertEqual(places_in_plan[0].daily_plan_id, "morning")

    def test_remove_from_daily_plan(self):
        user_id = self.manager.add_user(40.7128, -74.0060)
        self.manager.add_activity_group(user_id, "parks")
        self.manager.add_place("parks", user_id, "Central Park", "park1", 40.7829, -73.9654)
        self.manager.add_to_daily_plan(user_id, "morning", "park1")

        self.manager.remove_from_daily_plan(user_id, "park1")
        places_in_plan = self.manager.get_daily_plan(user_id, "morning")
        
        self.assertEqual(len(places_in_plan), 0)

if __name__ == '__main__':
    unittest.main()
