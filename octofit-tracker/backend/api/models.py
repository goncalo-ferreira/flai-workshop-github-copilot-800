from django.db import models
from bson import ObjectId


def generate_object_id():
    return str(ObjectId())


class User(models.Model):
    _id = models.CharField(max_length=24, primary_key=True, default=generate_object_id)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    team_id = models.CharField(max_length=24, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.name


class Team(models.Model):
    _id = models.CharField(max_length=24, primary_key=True, default=generate_object_id)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'teams'

    def __str__(self):
        return self.name


class Activity(models.Model):
    _id = models.CharField(max_length=24, primary_key=True, default=generate_object_id)
    user_id = models.CharField(max_length=24)
    activity_type = models.CharField(max_length=100)
    duration = models.IntegerField()  # in minutes
    distance = models.FloatField(null=True, blank=True)  # in km
    calories = models.IntegerField()
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'activities'

    def __str__(self):
        return f"{self.activity_type} - {self.duration} min"


class Leaderboard(models.Model):
    _id = models.CharField(max_length=24, primary_key=True, default=generate_object_id)
    user_id = models.CharField(max_length=24)
    team_id = models.CharField(max_length=24)
    total_points = models.IntegerField(default=0)
    rank = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'leaderboard'

    def __str__(self):
        return f"Rank {self.rank} - {self.total_points} points"


class Workout(models.Model):
    _id = models.CharField(max_length=24, primary_key=True, default=generate_object_id)
    title = models.CharField(max_length=255)
    description = models.TextField()
    exercise_type = models.CharField(max_length=100)
    difficulty = models.CharField(max_length=50)
    duration = models.IntegerField()  # in minutes
    calories_estimate = models.IntegerField()

    class Meta:
        db_table = 'workouts'

    def __str__(self):
        return self.title

