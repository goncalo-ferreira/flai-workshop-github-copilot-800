from django.core.management.base import BaseCommand
from api.models import User, Team, Activity, Leaderboard, Workout
from bson import ObjectId
from datetime import datetime, timedelta
import random


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        self.stdout.write('Clearing existing data...')
        
        # Delete existing data using Django ORM
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()
        
        self.stdout.write(self.style.SUCCESS('Existing data cleared'))
        
        # Create teams (Marvel and DC)
        self.stdout.write('Creating teams...')
        team_marvel = Team.objects.create(
            _id=str(ObjectId()),
            name='Team Marvel',
            description='Earth\'s Mightiest Heroes training together'
        )
        
        team_dc = Team.objects.create(
            _id=str(ObjectId()),
            name='Team DC',
            description='Justice League united in fitness'
        )
        
        self.stdout.write(self.style.SUCCESS(f'Created teams: {team_marvel.name}, {team_dc.name}'))
        
        # Create superhero users
        self.stdout.write('Creating users...')
        
        # Marvel superheroes
        marvel_heroes = [
            {'name': 'Iron Man', 'email': 'tony.stark@avengers.com'},
            {'name': 'Captain America', 'email': 'steve.rogers@avengers.com'},
            {'name': 'Thor', 'email': 'thor.odinson@avengers.com'},
            {'name': 'Black Widow', 'email': 'natasha.romanoff@avengers.com'},
            {'name': 'Hulk', 'email': 'bruce.banner@avengers.com'},
            {'name': 'Spider-Man', 'email': 'peter.parker@avengers.com'},
        ]
        
        # DC superheroes
        dc_heroes = [
            {'name': 'Superman', 'email': 'clark.kent@justiceleague.com'},
            {'name': 'Batman', 'email': 'bruce.wayne@justiceleague.com'},
            {'name': 'Wonder Woman', 'email': 'diana.prince@justiceleague.com'},
            {'name': 'The Flash', 'email': 'barry.allen@justiceleague.com'},
            {'name': 'Aquaman', 'email': 'arthur.curry@justiceleague.com'},
            {'name': 'Green Lantern', 'email': 'hal.jordan@justiceleague.com'},
        ]
        
        marvel_users = []
        dc_users = []
        
        for hero in marvel_heroes:
            user = User.objects.create(
                _id=str(ObjectId()),
                name=hero['name'],
                email=hero['email'],
                team_id=team_marvel._id
            )
            marvel_users.append(user)
        
        for hero in dc_heroes:
            user = User.objects.create(
                _id=str(ObjectId()),
                name=hero['name'],
                email=hero['email'],
                team_id=team_dc._id
            )
            dc_users.append(user)
        
        all_users = marvel_users + dc_users
        self.stdout.write(self.style.SUCCESS(f'Created {len(all_users)} superhero users'))
        
        # Create activities
        self.stdout.write('Creating activities...')
        activity_types = ['Running', 'Cycling', 'Swimming', 'Weightlifting', 'Yoga', 'Boxing']
        
        for user in all_users:
            # Create 3-5 random activities for each user
            num_activities = random.randint(3, 5)
            for _ in range(num_activities):
                activity_type = random.choice(activity_types)
                duration = random.randint(20, 90)
                distance = round(random.uniform(1, 15), 2) if activity_type in ['Running', 'Cycling', 'Swimming'] else None
                calories = duration * random.randint(5, 12)
                
                Activity.objects.create(
                    _id=str(ObjectId()),
                    user_id=user._id,
                    activity_type=activity_type,
                    duration=duration,
                    distance=distance,
                    calories=calories
                )
        
        self.stdout.write(self.style.SUCCESS(f'Created activities for all users'))
        
        # Create leaderboard entries
        self.stdout.write('Creating leaderboard entries...')
        
        leaderboard_data = []
        for user in all_users:
            # Calculate total points from activities
            user_activities = Activity.objects.filter(user_id=user._id)
            total_points = sum(activity.calories for activity in user_activities)
            
            leaderboard_data.append({
                'user': user,
                'total_points': total_points
            })
        
        # Sort by points and assign ranks
        leaderboard_data.sort(key=lambda x: x['total_points'], reverse=True)
        
        for rank, data in enumerate(leaderboard_data, start=1):
            Leaderboard.objects.create(
                _id=str(ObjectId()),
                user_id=data['user']._id,
                team_id=data['user'].team_id,
                total_points=data['total_points'],
                rank=rank
            )
        
        self.stdout.write(self.style.SUCCESS(f'Created leaderboard entries for all users'))
        
        # Create workout suggestions
        self.stdout.write('Creating workout suggestions...')
        
        workouts = [
            {
                'title': 'Superhero Circuit Training',
                'description': 'High-intensity circuit training to build strength and endurance like a true superhero',
                'exercise_type': 'Circuit Training',
                'difficulty': 'Hard',
                'duration': 45,
                'calories_estimate': 450
            },
            {
                'title': 'Speed Force Cardio',
                'description': 'Sprint intervals and agility drills to enhance speed and reflexes',
                'exercise_type': 'Cardio',
                'difficulty': 'Medium',
                'duration': 30,
                'calories_estimate': 350
            },
            {
                'title': 'Warrior Strength Training',
                'description': 'Heavy weightlifting focused on building raw power',
                'exercise_type': 'Weightlifting',
                'difficulty': 'Hard',
                'duration': 60,
                'calories_estimate': 400
            },
            {
                'title': 'Zen Mind Yoga Flow',
                'description': 'Relaxing yoga session for flexibility and mental clarity',
                'exercise_type': 'Yoga',
                'difficulty': 'Easy',
                'duration': 45,
                'calories_estimate': 200
            },
            {
                'title': 'Aquatic Power Swim',
                'description': 'Intense swimming workout for full-body conditioning',
                'exercise_type': 'Swimming',
                'difficulty': 'Medium',
                'duration': 40,
                'calories_estimate': 380
            },
            {
                'title': 'Combat Skills Boxing',
                'description': 'Boxing and martial arts training for combat readiness',
                'exercise_type': 'Boxing',
                'difficulty': 'Hard',
                'duration': 50,
                'calories_estimate': 500
            }
        ]
        
        for workout_data in workouts:
            Workout.objects.create(
                _id=str(ObjectId()),
                **workout_data
            )
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(workouts)} workout suggestions'))
        
        self.stdout.write(self.style.SUCCESS('✓ Database population completed successfully!'))
        self.stdout.write(f'  - Teams: {Team.objects.count()}')
        self.stdout.write(f'  - Users: {User.objects.count()}')
        self.stdout.write(f'  - Activities: {Activity.objects.count()}')
        self.stdout.write(f'  - Leaderboard: {Leaderboard.objects.count()}')
        self.stdout.write(f'  - Workouts: {Workout.objects.count()}')
