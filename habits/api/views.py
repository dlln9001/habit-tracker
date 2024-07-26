from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..models import Habit


@api_view(['POST', 'GET'])
def create_habit(request):
    print(request.data)
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