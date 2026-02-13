from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from .models import User, Team, Activity, Leaderboard, Workout
from datetime import datetime


class UserModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            name="Test User",
            email="test@example.com"
        )

    def test_user_creation(self):
        self.assertEqual(self.user.name, "Test User")
        self.assertEqual(self.user.email, "test@example.com")
        self.assertIsNotNone(self.user._id)

    def test_user_str(self):
        self.assertEqual(str(self.user), "Test User")


class TeamModelTest(TestCase):
    def setUp(self):
        self.team = Team.objects.create(
            name="Test Team",
            description="A test team"
        )

    def test_team_creation(self):
        self.assertEqual(self.team.name, "Test Team")
        self.assertEqual(self.team.description, "A test team")
        self.assertIsNotNone(self.team._id)

    def test_team_str(self):
        self.assertEqual(str(self.team), "Test Team")


class ActivityModelTest(TestCase):
    def setUp(self):
        self.activity = Activity.objects.create(
            user_id="test_user_id",
            activity_type="Running",
            duration=30,
            distance=5.0,
            calories=300
        )

    def test_activity_creation(self):
        self.assertEqual(self.activity.activity_type, "Running")
        self.assertEqual(self.activity.duration, 30)
        self.assertEqual(self.activity.distance, 5.0)
        self.assertEqual(self.activity.calories, 300)
        self.assertIsNotNone(self.activity._id)

    def test_activity_str(self):
        self.assertEqual(str(self.activity), "Running - 30 min")


class LeaderboardModelTest(TestCase):
    def setUp(self):
        self.leaderboard = Leaderboard.objects.create(
            user_id="test_user_id",
            team_id="test_team_id",
            total_points=100,
            rank=1
        )

    def test_leaderboard_creation(self):
        self.assertEqual(self.leaderboard.user_id, "test_user_id")
        self.assertEqual(self.leaderboard.total_points, 100)
        self.assertEqual(self.leaderboard.rank, 1)
        self.assertIsNotNone(self.leaderboard._id)

    def test_leaderboard_str(self):
        self.assertEqual(str(self.leaderboard), "Rank 1 - 100 points")


class WorkoutModelTest(TestCase):
    def setUp(self):
        self.workout = Workout.objects.create(
            title="Morning Run",
            description="A refreshing morning run",
            exercise_type="Cardio",
            difficulty="Medium",
            duration=45,
            calories_estimate=400
        )

    def test_workout_creation(self):
        self.assertEqual(self.workout.title, "Morning Run")
        self.assertEqual(self.workout.exercise_type, "Cardio")
        self.assertEqual(self.workout.difficulty, "Medium")
        self.assertEqual(self.workout.duration, 45)
        self.assertIsNotNone(self.workout._id)

    def test_workout_str(self):
        self.assertEqual(str(self.workout), "Morning Run")


class UserAPITest(APITestCase):
    def test_create_user(self):
        url = '/api/users/'
        data = {'name': 'API User', 'email': 'api@example.com'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().name, 'API User')

    def test_get_users(self):
        User.objects.create(name="User 1", email="user1@example.com")
        User.objects.create(name="User 2", email="user2@example.com")
        url = '/api/users/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)


class TeamAPITest(APITestCase):
    def test_create_team(self):
        url = '/api/teams/'
        data = {'name': 'API Team', 'description': 'Test team via API'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Team.objects.count(), 1)

    def test_get_teams(self):
        Team.objects.create(name="Team 1")
        Team.objects.create(name="Team 2")
        url = '/api/teams/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)


class ActivityAPITest(APITestCase):
    def test_create_activity(self):
        url = '/api/activities/'
        data = {
            'user_id': 'test_user',
            'activity_type': 'Swimming',
            'duration': 60,
            'calories': 500
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Activity.objects.count(), 1)


class WorkoutAPITest(APITestCase):
    def test_create_workout(self):
        url = '/api/workouts/'
        data = {
            'title': 'Test Workout',
            'description': 'A test workout',
            'exercise_type': 'Strength',
            'difficulty': 'Hard',
            'duration': 60,
            'calories_estimate': 600
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Workout.objects.count(), 1)
