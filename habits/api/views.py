from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..models import Habit
from .serializers import HabitSerializer


@api_view(['POST', 'GET'])
def create_habit(request):
    if request.data['time_amount']:
        new_habit = Habit(user=request.user,                            icon_url=request.data['chosen_icon'], 
                          name=request.data['habit_name'],              days=request.data['days_selected'], 
                          times_per_week=request.data['week_interval'], days_of_month=request.data['days_of_month_selected'],
                          duration=request.data['time_amount'],         notes=request.data['extra_notes'])
    else:
        new_habit = Habit(user=request.user,                            icon_url=request.data['chosen_icon'], 
                          name=request.data['habit_name'],              days=request.data['days_selected'], 
                          times_per_week=request.data['week_interval'], days_of_month=request.data['days_of_month_selected'],
                          quantity=request.data['goal_amount'],         notes=request.data['extra_notes'])
    new_habit.save()
    return Response({'getting response': 'true'})   


@api_view(['POST', 'GET'])
def get_habit(request):
    habits = Habit.objects.filter(user=request.user)
    serialized_habits = HabitSerializer(habits, many=True)
    return Response({'habits_data': serialized_habits.data})


@api_view(['POST', 'GET'])
def edit_habit(request):
    if request.user:
        habit_id = request.data['habit_id']
        habit = Habit.objects.get(id=habit_id)
        habit.name = request.data['habit_name']
        habit.days = request.data['habit_days']
        habit.times_per_week = request.data['habit_times_per_week']
        habit.days_of_month = request.data['habit_days_of_month']
        habit.notes = request.data['habit_notes']
        habit.icon_url = request.data['habit_icon']
        if request.data['habit_duration']:
            habit.duration = request.data['habit_duration']
        else:
            habit.quantity = request.data['habit_quantity']
        habit.save()
        return Response({'getting response': 'true'})


@api_view(['POST', 'GET'])
def delete_habit(request):
    habit_id = request.data['habit_id']
    habit = Habit.objects.get(id=habit_id)
    habit.delete()
    return Response({'getting response', 'true'})