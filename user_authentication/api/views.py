from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from .serializers import UserSerializer

# test connection
@api_view(['GET', 'POST'])
def test(request):
    return Response({'Connection': 'True!'})


@api_view(['GET', 'POST'])
def user_signup(request):
    serializer = UserSerializer(data=request.data)
    print('sdingininlk;ajsdl;fkjalksjdfkljasd', serializer, serializer.is_valid(), request.data)
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(username=request.data['username'])
        user.set_password(request.data['password'])
        user.save()
        token = Token.objects.create(user=user)
        return Response({'token': token.key, 'user': serializer.data})
    return Response({'username': 'A user with that username already exists.'})


@api_view(['GET', 'POST'])
def user_login(request):
    user = get_object_or_404(User, username=request.data['username'])
    if not user.check_password(request.data['password']):
        return Response({'details': 'failed'})
    token = Token.objects.filter(user=user).delete()  # delete old token if there is one
    token = Token.objects.create(user=user)  # want to create a new token every login 
    serializer = UserSerializer(instance=user)
    return Response({'token': token.key, 'user': serializer.data})
