from rest_framework import serializers
from .models import User, Team, Activity, Leaderboard, Workout


class UserSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='_id', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'team_id', 'created_at']


class TeamSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='_id', read_only=True)

    class Meta:
        model = Team
        fields = ['id', 'name', 'description', 'created_at']


class ActivitySerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='_id', read_only=True)

    class Meta:
        model = Activity
        fields = ['id', 'user_id', 'activity_type', 'duration', 'distance', 'calories', 'date']


class LeaderboardSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='_id', read_only=True)

    class Meta:
        model = Leaderboard
        fields = ['id', 'user_id', 'team_id', 'total_points', 'rank', 'updated_at']


class WorkoutSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='_id', read_only=True)

    class Meta:
        model = Workout
        fields = ['id', 'title', 'description', 'exercise_type', 'difficulty', 'duration', 'calories_estimate']
