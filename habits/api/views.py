from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['POST', 'GET'])
def create_habit(request):
    return Response({'getting response': 'true'})   