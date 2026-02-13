from django.contrib import admin
from .models import User, Team, Activity, Leaderboard, Workout


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['_id', 'name', 'email', 'team_id', 'created_at']
    search_fields = ['name', 'email']
    list_filter = ['created_at']


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ['_id', 'name', 'created_at']
    search_fields = ['name']
    list_filter = ['created_at']


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ['_id', 'user_id', 'activity_type', 'duration', 'calories', 'date']
    search_fields = ['user_id', 'activity_type']
    list_filter = ['activity_type', 'date']


@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ['_id', 'user_id', 'team_id', 'total_points', 'rank', 'updated_at']
    search_fields = ['user_id', 'team_id']
    list_filter = ['updated_at']
    ordering = ['rank']


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ['_id', 'title', 'exercise_type', 'difficulty', 'duration', 'calories_estimate']
    search_fields = ['title', 'exercise_type']
    list_filter = ['exercise_type', 'difficulty']
