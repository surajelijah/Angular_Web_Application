import { Component, Input, ViewChild } from '@angular/core';


@Component({
  selector: 'app-results-component',
  templateUrl: './results-component.component.html',
  styleUrls: ['./results-component.component.css']
})
export class ResultsComponentComponent {

@Input() event_details: any
@Input() results_show: any
@Input() content_display:any
@Input() event_clicked:any

@ViewChild('image_value') image_value:any



//event_clicked:boolean=false

venue_card_details:any
event_card_details:any
event_details_:any
artist_card_details:any
albums_length:any

image_urls:any=[]

event_date:any

storage_data:any=[]

favorite_value:any
favorite:boolean= false
favorite_image: string = "../../assets/heart2.png"
not_favorite_image: string= "../../assets/heart.png"
count=0


map:boolean=false

latitude_:any=0
longitude_:any=0

mapOptions: any = {
  center: { lat: this.latitude_, lng: this.longitude_ },
  zoom: 14
};

marker :any= {
  position: { lat: this.latitude_, lng: this.longitude_ },
}

showMore="Show More"
showLess="Show Less"

showvalue_oh:boolean=false
showvalue_gr:boolean=false
showvalue_cr:boolean=false



oh_show(){

  this.showvalue_oh=!this.showvalue_oh

}

gr_show(){
  this.showvalue_gr=!this.showvalue_gr
}

cr_show(){

  this.showvalue_cr=!this.showvalue_cr

}







tweet:any=""
fbpost:any=""

artist_show:boolean=false

event_id_clicked:string=""

ticket_status:string=""

card_title_name:string=""

constructor(){
  this.event_clicked=false
  this.favorite_value=this.not_favorite_image
  this.count=0    
}

ngOnChanges(){
  this.event_clicked=false
}

n_show_google_map(){

  this.map=false

  
  

}

show_google_map(){

  this.map=true
  

}







call_backend_for_eventcard_details(event_id:string){

  var parameters={
    'eventid':event_id,
  }

  fetch("https://hw8-mse4876294242-571.wl.r.appspot.com/eventcard?data=" + JSON.stringify(parameters))
      .then(data => data.json())
      .then(data =>{
        this.event_details_ = JSON.parse(JSON.stringify(data))
        console.log(data)

        this.event_card_details=this.event_details_['events'][0]
        this.venue_card_details=this.event_details_['venue'][0]
        this.artist_card_details= this.event_details_['music']

        this.event_date=this.event_card_details.AT
        //console.log(this.event_card_details.AT)

        var tweeturl=this.event_card_details['name'] + " on Ticketmaster."+ "\n" + this.event_card_details['BTA']
        this.tweet=`https://twitter.com/intent/tweet?text=${tweeturl}`


        this.fbpost="https://www.facebook.com/sharer/sharer.php?u=" + this.event_card_details['BTA']
        if(this.artist_card_details.length==0){
          this.artist_show=false
        }
        else{
          this.artist_show=true
          this.artist_card_details= this.event_details_['music']
          //console.log(this.artist_card_details)

          //this.albums_length=this.artist_card_details['images'].length
          console.log(this.artist_card_details[0]['images'])

          


        }

        this.latitude_=parseFloat(this.venue_card_details['latitude'])
        this.longitude_=parseFloat(this.venue_card_details['longitude'])


        this.mapOptions= {
          center: { lat: this.latitude_, lng: this.longitude_ },
          zoom: 14
        };

        this.marker= {
          position: { lat: this.latitude_, lng: this.longitude_ },
        }
        
        if(this.event_card_details.TS!='')
            this.ticket_status=this.event_card_details.TS
        
        
      })


}





show_details_card(event: any){

  this.event_clicked=true

  var event_id= event.srcElement.id
  
  // Name of the event is from the event.srcElement.innerHTML

  this.card_title_name=event.srcElement.innerHTML
  
  var clicked_location_ =event_id.split(',')[1]
  var clicked_location: number=+clicked_location_
  var event_id_=event_id.split(',')[0]
  
  var clicked_row=this.event_details[clicked_location]

  this.handle_local_storage_code(event_id_);
  this.storage_data=[]
  this.storage_data.push(event_id_)
  this.storage_data.push(clicked_row.date)
  this.storage_data.push(clicked_row.event)
  this.storage_data.push(clicked_row.venue)
  //Call the backend for Event Artist details 
  console.log(this.storage_data)
  this.call_backend_for_eventcard_details(event_id_);


  this.event_id_clicked=event_id
  
}

goto_results_table(){

  this.event_clicked=false
}


handle_local_storage_code(event_id: string){

      //console.log(event_id)

      //console.log(localStorage.getItem(event_id))
      if(localStorage.length==0){
        this.favorite=false
        this.favorite_value=this.not_favorite_image
      }
      else{

        if(event_id in localStorage){

          console.log("Hello")
          this.favorite=true
          this.favorite_value=this.favorite_image
        }
        else{
          this.favorite=false
          this.favorite_value=this.not_favorite_image
      }
    }
}

store_favorites(){

  if(this.favorite==false){
    
    alert("Event added to Favorites");
    this.favorite_value=this.favorite_image
    this.storage_data.push(document.getElementById("genres")?.innerHTML)
    localStorage.setItem(this.storage_data[0],this.storage_data)
    //Code to save the data in localstorage
    this.favorite=true

  }
  else{
    alert(" Removed from favorites")
    this.favorite_value=this.not_favorite_image
    localStorage.removeItem(this.storage_data[0])
    this.favorite=false
  }

}



}
