from django.http import JsonResponse

from rest_framework import generics 
from rest_framework.decorators import api_view 
from rest_framework.response import Response

from .serializers import * 

from datetime import date, datetime, time, timezone, timedelta
import calendar
import json 


@api_view(['GET',])
def blocked_days(request):
    query    = request.query_params
    print("query: ", query)
    response = []
    month    = query['month']
    year     = query['year']
    day      = datetime.strptime(f'{month}-{year}', "%m-%Y").date()
    advocat  = query['advocat']
    client   = query['client']
    advocat  = User.objects.get(id=advocat)
    client   = User.objects.get(id=client)
    days     = []
    for day in days:
        response.append(day)
    return Response(response)


@api_view(['POST','DELETE'])
def set_advocate_faculties(request):
    data        = request.data
    advocat_id  = data["advocat_id"]
    faculty_ids = data["faculty_ids"]
    faculty_ids = json.loads(faculty_ids)
    advocat     = User.objects.get(id=advocat_id)
    faculties   = Faculty.objects.filter(id__in=faculty_ids)
    advocat.faculties.clear()
    advocat.faculties.set(faculties)
    # if request.method == 'POST':
    #     advocat.faculties.add(faculty)
    # if request.method == 'DELETE':
    #     advocat.faculties.remove(faculty)
    return JsonResponse({'OK':'OK'})







@api_view(['POST'])
def add_advocate_document(request):
    data = request.data
    file = request.Files['file']
    advocat_id  = data.get("advocat_id")
    advocat = User.objects.get(id=advocat_id)
    documents = Document.objects.create(user=advocat, file=file)
    return JsonResponse({"OK": "OK"})
