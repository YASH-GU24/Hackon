import weaviate
import pandas as pd
from llm.get_movies import get_playlist_name
from renting.rent_model import predict_rent
from datetime import datetime
#setting up client
client = weaviate.Client("http://localhost:8080")

def convert_to_rfc3339(date_string):
    try:
        # Parse the input date string
        input_date = datetime.strptime(date_string, '%Y-%m-%d')

        # Add the time and format in RFC3339 format
        rfc3339_date = input_date.strftime('%Y-%m-%dT00:00:00Z')
        return rfc3339_date
    except ValueError:
        return "Invalid date format. Please use 'YYYY-MM-DD'."
    
def generate_or_string(path,values):
    where_operands = []
    for value in values:
        where_operands.append(
            {
                'path':path,
                "operator": "Like",
                "valueString": "*"+value.lower()+"*",
            }
        )
    if len(where_operands)==0:
        where_filter={}
    elif len(where_operands)==1:
        where_filter=where_operands[0]
    else:
        where_filter= {
        "operator": "Or",
        "operands":where_operands
        }
    return where_filter
def generate_or_text(path,values):
    where_operands = []
    for value in values:
        where_operands.append(
            {
                'path':path,
                "operator": "Like",
                "valueText": "*"+value.lower()+"*",
            }
        )
    if len(where_operands)==0:
        where_filter={}
    elif len(where_operands)==1:
        where_filter=where_operands[0]
    else:
        where_filter= {
        "operator": "Or",
        "operands":where_operands
        }
    return where_filter

def fetch_results(resp):
    where_operands = []
    if resp["date_published"]["greater_than"]!='':
        where_operands.append({
            "path": ["date_published"],
            "operator": "GreaterThan",
            "valueDate": convert_to_rfc3339(resp["date_published"]["greater_than"]),
        })
    if resp["date_published"]["less_than"]!='':
        where_operands.append({
            "path": ["date_published"],
            "operator": "LessThan",
            "valueDate": convert_to_rfc3339(resp["date_published"]["less_than"]),
        })
    if resp["duration"]["greater_than"]!='':
        where_operands.append({
            "path": ["duration"],
            "operator": "GreaterThan",
            "valueNumber": resp["duration"]["greater_than"],
        })
    if resp["duration"]["less_than"]!='':
        where_operands.append({
            "path": ["duration"],
            "operator": "LessThan",
            "valueNumber": resp["duration"]["less_than"],
        })
    if resp["RatingValue"]["greater_than"]!='':
        where_operands.append({
            "path": ["rating_value"],
            "operator": "GreaterThan",
            "valueNumber": resp["RatingValue"]["greater_than"],
        })
    if resp["RatingValue"]["less_than"]!='':
        where_operands.append({
            "path": ["rating_value"],
            "operator": "LessThan",
            "valueNumber": resp["RatingValue"]["less_than"],
        })
    print(resp)
    near_text = []
    if resp["Genres"]!=[] and resp["Genres"][0]!='':
        near_text = near_text + resp["Genres"]
    #     where_operands.append(generate_or_text('genres',resp['Genres']))
    if resp["actors"]!=[] and resp["actors"][0]!='':
        where_operands.append(generate_or_text('actors',resp['actors']))
    if resp["Director"]!=[] and resp["Director"][0]!='':
        # resp['chat_summary'] = resp['chat_summary']+' '.join(resp["Director"])
        where_operands.append(generate_or_string('director',resp['Director']))
    if resp["keywords"]!=[] and resp["keywords"][0]!='':
        near_text = near_text + resp["keywords"]
    #     where_operands.append(generate_or_text('keywords',resp["keywords"]))
    if resp["suggested_movie_titles"]!=[] and resp["suggested_movie_titles"][0]!='':
        near_text = near_text + resp["suggested_movie_titles"]
    if len(where_operands)==0:
        where_filter={}
    elif len(where_operands)==1:
        where_filter=where_operands[0]
    else:
        where_filter= {
        "operator": "And",
        "operands":where_operands
        }
    print(where_filter)
    if resp["chat_summary"]=='':
        resp["chat_summary"]=resp["answer"]
    near_text = near_text + [resp['chat_summary']]
    if where_filter:
        response = (
            client.query
            .get("Movies", ["movie_id","title","description","poster_link","actors","duration","date_published","director","rating_value"])
            .with_near_text({
                "concepts": near_text
            })
            .with_where(where_filter)
            .with_additional(["distance"])
            .with_limit(200)
            .do()
        )
    else:
        response = (
            client.query
            .get("Movies", ["movie_id","title","description","poster_link","actors","duration","date_published","director","rating_value"])
            .with_near_text({
                "concepts": resp["chat_summary"]
            })
            .with_additional(["distance"])
            .with_limit(200)
            .do()
        )
    # print(response)
    results = [{"id": d.pop("movie_id"), **d} for d in response['data']['Get']['Movies']]
    return results

def get_movie_by_id(id):
    response = (
            client.query
            .get("Movies", ["movie_id","url","title","genres","description","poster_link","actors","duration","date_published","director","rating_value","rating_count"])
            .with_where({"path":"movie_id","operator":"Equal","valueNumber":int(id)})
            .with_additional(["distance"])
            .do()
        )
    date_obj = datetime.strptime(response['data']['Get']['Movies'][0]['date_published'], "%Y-%m-%dT%H:%M:%SZ")
    year = date_obj.year
    rent_price = predict_rent([[response['data']['Get']['Movies'][0]['rating_value'],response['data']['Get']['Movies'][0]['rating_count'],year]])
    response['data']['Get']['Movies'][0]['rentPrice'] = round(rent_price,2)
    return response['data']['Get']['Movies'][0]

def recommend_movie_by_id(id):
    response = (
            client.query
            .get("Movies", ["movie_id","title","description","poster_link","actors","duration","date_published","director","rating_value"])
            .with_where({"path":"movie_id","operator":"Equal","valueNumber":int(id)})
            .with_additional(["distance","id"])
            .do()
        )
    response2 = (
        client.query
            .get("Movies", ["movie_id","title","description","poster_link","actors","duration","date_published","director","rating_value"])
            .with_near_object({"id":response["data"]["Get"]["Movies"][0]["_additional"]["id"]})
            .with_additional(["distance"])
            .with_limit(10)
            .do()
    )
    results = [{"id": d.pop("movie_id"), **d} for d in response2['data']['Get']['Movies']]
    response ={"id":int(id),"movies":results[1:]}
    return response

def get_playlist_by_id(id):
    response = (
            client.query
            .get("Movies", ["movie_id","title","description","poster_link","actors","duration","date_published","director","rating_value"])
            .with_where({"path":"movie_id","operator":"Equal","valueNumber":int(id)})
            .with_additional(["distance","id"])
            .do()
        )
    response2 = (
        client.query
            .get("Movies", ["movie_id","title","description","poster_link","actors","duration","date_published","director","rating_value"])
            .with_near_object({"id":response["data"]["Get"]["Movies"][0]["_additional"]["id"]})
            .with_additional(["distance"])
            .with_limit(17)
            .do()
    )
    response = []
    results = [{"id": d.pop("movie_id"), **d} for d in response2['data']['Get']['Movies']]
    parent_mov = response2['data']['Get']['Movies'][0]
    parent_title = response2['data']['Get']['Movies'][0]['title']
    playlist_titles = [parent_title]
    playlists = []
    for i in range(1,len(results)):
        playlist_titles.append(results[i]['title'])
        if len(playlist_titles)>=5:
            name = get_playlist_name(playlist_titles)['name']
            parent_mov['name'] = name
            playlists.append(
                {
                    'id':int(id),
                    'name':name,
                    'movies':[parent_mov,results[i-3],results[i-2],results[i-1],results[i]]
                }
            )
            playlist_titles = [parent_title]
    return {'id':int(id),'name':parent_title,'playlists':playlists}

def get_by_plot(query):
    response = (
            client.query
            .get("Movies", ["movie_id","title","description","poster_link","actors","duration","date_published","director","rating_value"])
            .with_near_text({
                "concepts": query
            })
            .with_additional(["distance"])
            .with_limit(20)
            .do()
        )
    results = [{"id": d.pop("movie_id"), **d} for d in response['data']['Get']['Movies']]
    return results

# def get_timestamp(start_index):
#     response = (
#         client.query
#         .get("Timestamps", ['startIndex', 'time'])
#         .withWhere({
#         'operator': 'GreaterThan',
#         'path': ['endIndex'],
#         'valueNumber': int(start_index)
#         })
#         .with_sort([{ 'path': ['startIndex'], 'order': 'asc' }])
#         .with_limit(1)
#         .do()
#     )
#     return response

# def get_answer(searched_question):
#     response = (
#         client.query
#         .get("Caption")
#         .with_ask({
#         'question': searched_question,
#         'properties': ["text"],
#         }).with_additional(["answer"])
#         .with_sort([{ 'path': ['startIndex'], 'order': 'asc' }])
#         .with_limit(1)
#         .do()
#     )
#     return response 

# print(get_answer("what is fastapi"))