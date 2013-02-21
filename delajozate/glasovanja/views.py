#-*- coding: utf-8 -*-

import datetime
import json
from pprint import pprint

from django.shortcuts import render
from django.http import Http404, HttpResponse
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from magnetogrami.models import Glasovanje, Glas

def index(request):
    glasovanja_list = Glasovanje.objects.all().select_related('seja')
    paginator = Paginator(glasovanja_list, 100)
    page = request.GET.get('page', 1)
    try:
        glasovanja = paginator.page(page)
    except PageNotAnInteger:
        glasovanja = paginator.page(1)
    except EmptyPage:
        glasovanja = paginator.page(paginator.num_pages)
    
    context = {
        'glasovanja': glasovanja,
        }
    return render(request, 'glasovanja.html', context)

def glasovanje(request, datum, ura=None, pk=None, ajax=False):
    datum = datetime.datetime.strptime(datum, '%Y-%m-%d').date()
    
    if ura is not None:
        ura = datetime.datetime.strptime(ura, '%H:%M:%S').time()
        glasovi = Glas.objects.filter(
            glasovanje__datum=datum,
            glasovanje__ura=ura)
    elif pk is not None:
        glasovi = Glas.objects.filter(glasovanje__id=pk)
    else:
        raise Http404
    
    glasovi = glasovi.select_related('oseba')

    if ajax:
        voting_result = []
        glasovanje = glasovi[0].glasovanje
        summary_skupaj = glasovanje.summary['votes']['skupaj']

        if glasovanje.summary['majority'] == 'za':
            data = {
                'za': summary_skupaj['majority'],
                'proti': summary_skupaj['minority'],
            }
        else:
            data = {
                'za': summary_skupaj['minority'],
                'proti': summary_skupaj['majority']
            }
        data[u'vzdržani'] = summary_skupaj['abstained']
        data[u'odsotni'] = summary_skupaj['absent']

        data_list = [{'label': key, 'count': data[key]} for key in data]

        json_data = {'summary':data_list}
        return HttpResponse(json.dumps(json_data), mimetype="application/json")
    else:
        context = {
            'objects': glasovi,
        }
        return render(request, 'glasovanje.html', context)
