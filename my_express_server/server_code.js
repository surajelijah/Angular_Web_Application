

const express = require("express");
const axios = require("axios")
const cors = require("cors")
const geohash = require("ngeohash")
const SpotifyWebApi = require('spotify-web-api-node')


var latitude;
var longitude;
let geohash_value;
const app = express();

app.use(express.json())
app.use(cors())

function prepare_event_data(data_dictonary,data_events_){

    date=time=icon=event=genre=venue=event_id=event_name=0

    var count=0

    if(data_events_['page']['totalElements']!=0){

        //console.log(data_events['_embedded']['events'])
        var data_events = data_events_['_embedded']['events']

        for(var events in data_events){

            if(count==20)
                break
            //console.log(data_events[events])
            
            /*
            if('dates' in events && 'start' in events['dates'] && 'localDate' in events['dates']['start'])
                    date=events['dates']['start']['localDate']
                else
                    date=" "
            
                if('dates' in events && 'start' in events['dates'] && 'localTime' in events['dates']['start'])
                    time=events['dates']['start']['localTime']
                else
                    time=" "

                if('images' in events && events['images'].length !=0 && 'url' in events['images'][0])
                    icon=events['images'][0]['url']
                else
                    icon=" "
                
                if('name' in events)
                    event_name=events['name']
                else
                    event_name=" "
                
                if('classifications' in events && (events['classifications']).length!=0 && 'segment' in events['classifications'][0] && 'name' in events['classifications'][0]['segment'])
                    genre=events['classifications'][0]['segment']['name']
                else
                    genre=" "

                if('_embedded' in events && 'venues' in events['_embedded'] && (events['_embedded']['venues']).length!=0 && 'name' in events['_embedded']['venues'][0])
                    venue=events['_embedded']['venues'][0]['name']
                else
                   venue=" "

                if('id' in events)
                   event_id=events['id']
                else
                   event_id=" "
                */   
                if('dates' in data_events[events] && 'start' in data_events[events]['dates'] && 'localDate' in data_events[events]['dates']['start'])
                   date=data_events[events]['dates']['start']['localDate']
               else
                   date=" "
           
               if('dates' in data_events[events] && 'start' in data_events[events]['dates'] && 'localTime' in data_events[events]['dates']['start'])
                   time=data_events[events]['dates']['start']['localTime']
               else
                   time=" "

               if('images' in data_events[events] && data_events[events]['images'].length !=0 && 'url' in data_events[events]['images'][0])
                   icon=data_events[events]['images'][0]['url']
               else
                   icon=" "
               
               if('name' in data_events[events])
                   event_name=data_events[events]['name']
               else
                   event_name=" "
               
               if('classifications' in data_events[events] && (data_events[events]['classifications']).length!=0 && 'segment' in data_events[events]['classifications'][0] && 'name' in data_events[events]['classifications'][0]['segment'])
                   genre=data_events[events]['classifications'][0]['segment']['name']
               else
                   genre=" "

               if('_embedded' in data_events[events] && 'venues' in data_events[events]['_embedded'] && (data_events[events]['_embedded']['venues']).length!=0 && 'name' in data_events[events]['_embedded']['venues'][0])
                   venue=data_events[events]['_embedded']['venues'][0]['name']
               else
                  venue=" "

               if('id' in data_events[events])
                  event_id=data_events[events]['id']
               else
                  event_id=" "

                data_dictonary['events'].push({'date':date,'time':time,'icon':icon,'event':event_name,'genre':genre,'venue':venue,'event_id':event_id})
                
                count=count+1
                //console.log(count)
        }

        //console.log(data_dictonary)

        data_dictonary['events'].sort(function(a,b){

            return  ((new Date(String(a.date))).getTime()) - ((new Date(String(b.date))).getTime()) 
        });

        //console.log(data_dictonary)


    }
    else
        console.log("print No events")
    
    //console.log(data_dictonary)

    /*data_dictonary['events'].sort(function(a,b){

        var day1=(new Date(a.data + 'T' + a.time+'Z')).getTime()
        var day2 = (new Date(b.data + 'T' + b.time+'Z')).getTime()
        return  day1 - day2  
    });*/


    return data_dictonary
}




function get_geohash(latitude,longitude ,response_call,parameters){

    geohash_value= geohash.encode(latitude,longitude);

    parameters['geoPoint']=geohash_value
    //console.log(parameters)

    const searchparams= new URLSearchParams(parameters);


    axios.get("https://app.ticketmaster.com/discovery/v2/events.json?" + searchparams.toString())
    .then(res =>{

        var event_data=JSON.parse(JSON.stringify(res.data))


        data_dictonary={'events':[]}

        data_dictionary=prepare_event_data(data_dictonary,event_data)
        //console.log(data_dictionary)

        response_call.send(data_dictionary)
    }) 
    
    //console.log("https://app.ticketmaster.com/discovery/v2/events.json?"+searchparams.toString())
    
}

global.globalString=""

/*
In this get function call we define what happens when frontend sends a get request to '/' with the req and res
parameters
*/
app.get('/event',async function(request,response){

    var ticket_API_key="J3XzwuSYkREWmocLsLrgmFLRAAX7UDpt"
    var geocoding_API_key="AIzaSyAknEIn-3stDyowTOir5fsJ9U04VT2IP2g"


    var data=JSON.parse(request.query.data)
    console.log(data)

    category_mapping= {'Default':'','Music':'KZFzniwnSyZfZ7v7nJ','Sports':'KZFzniwnSyZfZ7v7nE','Theatre':'KZFzniwnSyZfZ7v7na','Arts':'KZFzniwnSyZfZ7v7na','Film':'KZFzniwnSyZfZ7v7nn','Miscellaneous':'KZFzniwnSyZfZ7v7n1'}

    globalString=data.category

    parameters = {'apikey':ticket_API_key,
    'keyword':data.keyword,
    'segmentId':category_mapping[data.category],
    'radius':data.distance,
    'unit':'miles',
    }


    if(data.checkbox==true){

        var latlong=data.location.split(',')
        latitude=latlong[0]
        longitude=latlong[1]

        get_geohash(latitude,longitude,response,parameters);
    }
    else{
        
        var location=data.location;
        var geocode_url = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${geocoding_API_key}`;
        
        
        
        /*let latlong_=fetch(geocode_url)
        .then(res => res.json())
        .then(res => {
            var latlong_ = JSON.parse(JSON.stringify(res))
            /*latitude=latlong_['results'][0]['geometry']['location']['lat']
            longitude=latlong_['results'][0]['geometry']['location']['lng']
            console.log(latitude,longitude)
            
           return JSON.parse(JSON.stringify(res))
        })*/

        /*async function getAPI(geocode_url){
            const res= await axios.get(geocode_url);
            return res.data
        }
        const value=getAPI(geocode_url);
        console.log(value)*/

        axios.get(geocode_url)
        .then(res => {

            var latlong_ = res.data;
            latitude=latlong_['results'][0]['geometry']['location']['lat']
            longitude=latlong_['results'][0]['geometry']['location']['lng']
            get_geohash(latitude,longitude,response,parameters);
        })
    }


    //response.send(data);

});

function prepare_eventcard_data(data_dictionary_,response_data){

    var data_dictionary={}
    date=time=at_url=venue=genre=pr=ticket_status=bta=seat_map=0
    at=""

    if(response_data.length!=0){

        if('dates' in response_data && 'start' in response_data['dates'] && 'localDate' in response_data['dates']['start'])
                date= response_data['dates']['start']['localDate']
        
        if('dates' in response_data && 'start' in response_data['dates'] && 'localTime' in response_data['dates']['start'])
                time= response_data['dates']['start']['localTime']
        else
                time=" "

        data_dictionary['data']=date
        data_dictionary['time']=time
        
        if('_embedded' in response_data && 'attractions' in response_data['_embedded'] && (response_data['_embedded']['attractions']).length!=0)
        {  
            for(var key in response_data['_embedded']['attractions']){
                if('name' in response_data['_embedded']['attractions'][key])      
                at=at+response_data['_embedded']['attractions'][key]['name'] +'| '
            }
            data_dictionary['AT']=at
        }

        if('_embedded' in response_data && 'attractions' in response_data['_embedded'] && (response_data['_embedded']['attractions']).length!=0 && 'url' in response_data['_embedded']['attractions'][0])
        {        at_url=response_data['_embedded']['attractions'][0]['url']
                data_dictionary['AT_URL']=at_url
        }

        if('_embedded' in response_data && 'venues' in response_data['_embedded'] && (response_data['_embedded']['venues']).length!=0 && 'name' in response_data['_embedded']['venues'][0])
        {        venue=response_data['_embedded']['venues'][0]['name']
                 data_dictionary['venue']=venue
        }

        if('classifications' in response_data && (response_data['classifications']).length!=0){


            if('segment' in response_data['classifications'][0] && 'name' in response_data['classifications'][0]['segment'])
                    if(response_data['classifications'][0]['segment']['name']!='Undefined')
                        genre=response_data['classifications'][0]['segment']['name']+" | "
                
                if('genre' in response_data['classifications'][0] && 'name' in response_data['classifications'][0]['segment'])
                    if(response_data['classifications'][0]['genre']['name']!='Undefined')
                        genre=genre+response_data['classifications'][0]['genre']['name']+" | "
                
                if('subGenre' in response_data['classifications'][0] && 'name' in response_data['classifications'][0]['segment'])
                    if(response_data['classifications'][0]['subGenre']['name']!='Undefined')
                        genre=genre+response_data['classifications'][0]['subGenre']['name']+" | "
                
                if('type' in response_data['classifications'][0] && 'name' in response_data['classifications'][0]['segment'])
                    if(response_data['classifications'][0]['type']['name']!='Undefined')
                        genre=genre+response_data['classifications'][0]['type']['name']+" | "
                
                if('subType' in response_data['classifications'][0] && 'name' in response_data['classifications'][0]['segment'])
                    if(response_data['classifications'][0]['subType']['name']!='Undefined')
                        genre=genre+response_data['classifications'][0]['subType']['name']

        }
        data_dictionary['genres']=genre

        if('priceRanges' in response_data && (response_data['priceRanges']).length!=0 && 'min' in response_data['priceRanges'][0])
                pr=response_data['priceRanges'][0]['min']+" - "

        if('priceRanges' in response_data && (response_data['priceRanges']).length!=0 && 'max' in response_data['priceRanges'][0])
        {       
             pr=pr+response_data['priceRanges'][0]['max']+" USD"
             data_dictionary['PR']=pr
        }
        if('dates' in response_data && 'status' in response_data['dates'] && 'code' in response_data['dates']['status'])
        {    
            ticket_status= response_data['dates']['status']['code']
            data_dictionary['TS']=ticket_status
        }

        if('url' in response_data){
                bta=response_data['url']
                data_dictionary['BTA']=bta
        }

        if('seatmap' in response_data && 'staticUrl' in response_data['seatmap']){
                seat_map=response_data['seatmap']['staticUrl']
                data_dictionary['SM']=seat_map
        }

        data_dictionary['name']=response_data['name']

    }

    data_dictionary_['events'].push(data_dictionary)

    return data_dictionary_
}

function prepare_venue_data(data_dictionary_,response_data){

    var data_dictionary={}
    name_=address=city=state=phone=oh=gr=cr=latitude=longitude=""


    if(response_data.length!=0){

        if('_embedded' in response_data){


            if((response_data['_embedded']).length!=0){


                if('venues' in response_data['_embedded'] && (response_data['_embedded']['venues']).length!=0 && 'name' in response_data['_embedded']['venues'][0])
                {        name_=response_data['_embedded']['venues'][0]['name']
                        data_dictionary['name']=name_
                }

                if('venues' in response_data['_embedded'] && (response_data['_embedded']['venues']).length!=0 && 'address' in response_data['_embedded']['venues'][0] && 'line1' in response_data['_embedded']['venues'][0]['address'])
                {        address=response_data['_embedded']['venues'][0]['address']['line1']
                        data_dictionary['address']=address
                }

                if('venues' in response_data['_embedded'] && (response_data['_embedded']['venues']).length!=0 && 'city' in response_data['_embedded']['venues'][0] && 'name' in response_data['_embedded']['venues'][0]['city'])
                        city=response_data['_embedded']['venues'][0]['city']['name']    

                if('venues' in response_data['_embedded'] && (response_data['_embedded']['venues']).length!=0 && 'state' in response_data['_embedded']['venues'][0] && 'name' in response_data['_embedded']['venues'][0]['state'])
                        state=response_data['_embedded']['venues'][0]['state']['name']

                data_dictionary['city']= city +', '+ state

                if('venues' in response_data['_embedded'] && (response_data['_embedded']['venues']).length!=0 && 'boxOfficeInfo' in response_data['_embedded']['venues'][0] && 'phoneNumberDetail' in response_data['_embedded']['venues'][0]['boxOfficeInfo'])
                    phone=response_data['_embedded']['venues'][0]['boxOfficeInfo']['phoneNumberDetail']


                if('venues' in response_data['_embedded'] && (response_data['_embedded']['venues']).length!=0 && 'boxOfficeInfo' in response_data['_embedded']['venues'][0] && 'openHoursDetail' in response_data['_embedded']['venues'][0]['boxOfficeInfo'])
                    oh=response_data['_embedded']['venues'][0]['boxOfficeInfo']['openHoursDetail']

                if('venues' in response_data['_embedded'] && (response_data['_embedded']['venues']).length!=0 && 'generalInfo' in response_data['_embedded']['venues'][0] && 'generalRule' in response_data['_embedded']['venues'][0]['generalInfo'])
                    gr=response_data['_embedded']['venues'][0]['generalInfo']['generalRule']

                if('venues' in response_data['_embedded'] && (response_data['_embedded']['venues']).length!=0 && 'generalInfo' in response_data['_embedded']['venues'][0] && 'childRule' in response_data['_embedded']['venues'][0]['generalInfo'])
                    cr=gr=response_data['_embedded']['venues'][0]['generalInfo']['childRule']
                
                if('venues' in response_data['_embedded'] && (response_data['_embedded']['venues']).length!=0 && 'location' in response_data['_embedded']['venues'][0] && 'longitude' in response_data['_embedded']['venues'][0]['location'])
                    longitude=response_data['_embedded']['venues'][0]['location']['longitude']

                if('venues' in response_data['_embedded'] && (response_data['_embedded']['venues']).length!=0 && 'location' in response_data['_embedded']['venues'][0] && 'latitude' in response_data['_embedded']['venues'][0]['location'])
                    latitude=response_data['_embedded']['venues'][0]['location']['latitude']


                data_dictionary['phone']=phone
                data_dictionary['oh']=oh
                data_dictionary['gr']=gr
                data_dictionary['cr']=cr
                data_dictionary['longitude']=longitude
                data_dictionary['latitude']=latitude
                }
        }
    }


    data_dictionary_['venue'].push(data_dictionary)

    return data_dictionary_
}

function spotify_artists_data(data_dictionary_,response_data,response_call){


    console.log("Music Data")


}


function spotify_artists_data_(data_dictionary_,spotifyApi,response_call){

            spotifyApi.searchArtists('Love')
            .then(function(data) {
                console.log('Search artists by "Love"', data.body);

                var spotify_artists_data=JSON.parse(JSON.stringify(data.body))

                var data_dictionary=spotify_artists_data(data_dictionary_,spotify_artists_data,response_call) 

                //return response_call.send(data_dictionary)

            }, function(err) {
            console.error(err);
            });
}



function spotify_call(spotifyApi,data_dictionary,artists_items,artists_names,length_,response_call){


            if(length_==0){

                //artists_items=Array.from(new Set(artists_items))
                console.log(artists_items)
                data_dictionary['music']=artists_items
                response_call.send(data_dictionary)

            }
            else{
            spotifyApi.searchArtists(artists_names[length_].trim())
            .then(function(data) {
                var data=JSON.parse(JSON.stringify(data))

                var artists=data['body']['artists']['items']
                //console.log('Search by "Love"', data['body']['artists']['items'][0]['name']);

                if('artists' in data['body'] && 'items' in data['body']['artists'] && (data['body']['artists']['items']).length!=0){

                    //data_dictionary['music']= data['body']['artists']['items']
                    //response_call.send(data_dictionary)
                    var data_items=data['body']['artists']['items']
                    for(var i in data_items){

                            var music_data={}
                            if('type' in data_items[i] && data_items[i]['type']=='artist'){
                                
                                
                                if('name' in data_items[i])
                                //artists_items.push(data_items[i]['name'])
                                        music_data['name']=data_items[i]['name']
                                if('popularity' in data_items[i])
                                        music_data['popularity']=data_items[i]['popularity']

                                if('followers' in data_items[i] && 'total' in data_items[i]['followers'])
                                    music_data['followers']=data_items[i]['followers']['total']
                                
                                if('external_urls' in data_items[i] && 'spotify' in data_items[i]['external_urls'])
                                    music_data['spotify']=data_items[i]['external_urls']['spotify']

                                if('images' in data_items[i]){

                                    var image_urls=[]

                                    for(var key in data_items[i]['images']){

                                        if('url' in data_items[i]['images'][key])
                                            image_urls.push(data_items[i]['images'][key]['url'])
                                    }

                                    music_data['images']=image_urls
                                }
                                artists_items.push(music_data)
                                //console.log(artists_items)
                            }

                    }
                 }          

                 spotify_call(spotifyApi,data_dictionary,artists_items,artists_names,length_-1,response_call)

                }, function(err) {
                console.error(err);
                });
            }   
    
}








function prepare_venue_data_(data_dictionary_,response_call){

    //var data_dictionary={}
    var ticket_API_key="J3XzwuSYkREWmocLsLrgmFLRAAX7UDpt"

    var spotifyClientID="0999aa00f3b948c89fc2f13650135ee0"
    var spotifyClientSecret="276877bf395d4c9c8bfac815c0bbf0cc"

    //name_=address=city=state_code=pc=uc=""
    
    var category_name_=globalString
    var parameters={
        'apikey':ticket_API_key,
        'keyword':data_dictionary_['events'][0]['venue']
    }

    const searchparams= new URLSearchParams(parameters);

    var venue_url= "https://app.ticketmaster.com/discovery/v2/venues/?" + searchparams.toString()

    axios(venue_url)
    .then(res =>{

        var venue_card_data=JSON.parse(JSON.stringify(res.data))

        console.log(venue_url)
        console.log(venue_card_data)

        var data_dictionary=prepare_venue_data(data_dictionary_,venue_card_data)

        console.log(data_dictionary)
        var genre_name_= data_dictionary_['events'][0]['genres'].includes('Music')

        var spotifyApi = new SpotifyWebApi({
            clientId: '0999aa00f3b948c89fc2f13650135ee0',
            clientSecret: '276877bf395d4c9c8bfac815c0bbf0cc',
            redirectUri: 'http://localhost:8888/callback'
          });
        var accesstoken=""
        spotifyApi.setAccessToken('<your_access_token>');
        if(genre_name_){
            //Spotify Call
            if(accesstoken.length==0)
            {
                //spotify_artists_data_(data_dictionary,spotifyApi,response_call);

                //spotifyApi.authorizationCodeGrant()

                spotifyApi.clientCredentialsGrant()
                .then((res)=>{
                    console.log(res.body["access_token"])
                    spotifyApi.setAccessToken(res.body["access_token"])

                    var artists_names=data_dictionary['events'][0]['AT']
                    //console.log(artists_names)
                    /*if(artists_names==undefined){
                        data_dictionary['music']=artists_items
                        response_call.send(data_dictionary)
                        return 
                     }*/
                    artists_names=artists_names.substring(0,artists_names.length-1)
                    artists_names=artists_names.split('|')
                    artists_length=artists_names.length
                    var artists_items=[]
                    //console.log(artists_names)
                    if(artists_length!=0)
                        spotify_call(spotifyApi,data_dictionary,artists_items,artists_names,artists_length-2,response_call)
                    // console.log(artists_item )
                    

                    //data_dictionary['music']=global.artists_items
                    //response_call.send(data_dictionary)
                    
                });

            }

        }
        else
            return response_call.send(data_dictionary)
        
    })

}








app.get('/eventcard',function(request,response){

    var ticket_API_key="J3XzwuSYkREWmocLsLrgmFLRAAX7UDpt"

    var data=JSON.parse(request.query.data)
    //console.log(data)
    var event_card_data_url = `https://app.ticketmaster.com/discovery/v2/events/${data.eventid}?apikey=${ticket_API_key}`
    
    /*var parameters={
        'apikey':ticket_API_key,
        'keyword':globalString
    }

    const searchparams= new URLSearchParams(parameters);

    var venue_url= "https://app.ticketmaster.com/discovery/v2/venues/?" + searchparams.toString()

    */


    console.log(event_card_data_url)
    //console.log(globalString)
    axios.get(event_card_data_url)
    .then(res =>{

        var event_card_data=JSON.parse(JSON.stringify(res.data))

        //console.log(event_card_data_url)
        //console.log(event_card_data)
        data_dictonary={'events':[],'venue':[],'music':[]}  

        data_dictionary=prepare_eventcard_data(data_dictonary,event_card_data)

        data_dictionary=prepare_venue_data_(data_dictionary,response)
        //console.log(data_dictionary)


    }) 

    //response.send(data);
});

/* Defining Route
app.get('/hobbies',function(request,response){

    response.send("Hobbies");

});
*/

const hostname='0.0.0.0'
const port= process.env.PORT || 8000

app.listen(port,hostname,function(){

    console.log("Sever started ");
});