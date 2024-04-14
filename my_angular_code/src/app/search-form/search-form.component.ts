import { Component, Input, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResultsComponentComponent } from '../results-component/results-component.component';



@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent {

  keyword_value :any=''
  location_value : any=''
  category_value : string=""
  distance_value : number=10
  location_check_value :boolean =false
  ticket_API_key="J3XzwuSYkREWmocLsLrgmFLRAAX7UDpt"
  latlongval:any
  event_details:any

  results_show : boolean=false
  content_display: boolean=false
  event_clicked:boolean=false

  options :string[] =[]

  @ViewChild('category') category:any ;


  constructor(public httpClient: HttpClient){

    this.results_show=false
    this.content_display=false
  }

  get_autocomplete_options(event:any){

    /*if(this.options.length!=0)
      this.options=[]
    */
    if(this.keyword_value.trim()===0)
        return
    

    this.options=[]

    
     var search_keyword=this.keyword_value

     var url_string = `https://app.ticketmaster.com/discovery/v2/suggest?apikey=${this.ticket_API_key}&keyword=${search_keyword}` 
     
     fetch(url_string)
     .then(res=>res.json())
     .then(res => {

      var suggestions = JSON.parse(JSON.stringify(res))['_embedded']['attractions']

      for( const i in suggestions){
        this.options.push(<string>suggestions[i]['name'])
      }

     })
  }
  
  clear_values(){

      this.keyword_value=" "
      this.location_value=" "
      this.distance_value=10
      this.location_check_value=false
      this.category.nativeElement.value="Default"
      this.options=[]

      this.content_display=false
      this.results_show=false
      this.event_clicked=false
      
      console.log("Suraj")

  }

  form_handle(){
    
    console.log("In form Handle")
    console.log(this.keyword_value)
    console.log(this.location_value)
    console.log(this.distance_value)
    console.log(this.location_check_value)
    console.log(this.category.nativeElement.value)

    //Code for setting event and true values for proper display

    this.content_display=false
    this.results_show=false
    this.event_clicked=false

    if(this.keyword_value==" ")
      this.keyword_value=""

    if(this.location_check_value==false && this.location_value===""){
      this.location_value=""
      return 
    }

    if(this.location_check_value==false && this.location_value===" ")
      this.location_value=""

    this.category_value=this.category.nativeElement.value

    if(this.keyword_value=='' || (this.location_check_value==false && this.location_value==''))
      return 

    if(this.category_value==="Arts & Theatre")
      this.category_value="Arts"

    if(this.location_check_value==true){

      var parameters_={

        keyword:this.keyword_value,
        distance:this.distance_value,
        category:this.category_value,
        checkbox:this.location_check_value
      }

      this.get_coordinate_values(parameters_)
    }
    else{

      var parameters={

        keyword:this.keyword_value,
        location:this.location_value.trim(),
        distance:this.distance_value,
        category:this.category_value,
        checkbox:this.location_check_value
      }

      fetch("https://hw8-mse4876294242-571.wl.r.appspot.com/event?data=" + JSON.stringify(parameters))
      .then(data => data.json())
      .then(data =>{
        this.event_details = JSON.parse(JSON.stringify(data.events))
        //console.log(data.events)
        console.log(this.event_details)
        this.content_display=true
        if(this.event_details.length==0)
          this.results_show=false
        else
          this.results_show=true
      })

    }
  }

  get_category_value(val:any){
    this.category_value=val
  }

  public call_backend(latlong:string,parameters:any){

    
    parameters['location'] = latlong
    
    fetch("https://hw8-mse4876294242-571.wl.r.appspot.com/event?data=" + JSON.stringify(parameters))
      .then(data => data.json())
      .then(data =>{
        //console.log(data)
        //Assign event detail values

        this.event_details = JSON.parse(JSON.stringify(data.events))
        console.log(this.event_details.length)
        console.log(data)
        
        this.content_display=true

        if(this.event_details.length==0)
          this.results_show=false
        else
          this.results_show=true
      })

  }

  get_coordinate_values(parameters :any){

  var ipinfo_key="ee8392e5a888a4";
  
  fetch("https://ipinfo.io/?token=" + ipinfo_key)
  .then(data => data.json())
  .then(latlong => {

    var latlong= JSON.parse(JSON.stringify(latlong))['loc']
    
    var lat= latlong.split(',')[0]
    var longitude=latlong.split(',')[1]
    this.call_backend(latlong,parameters)
    
  })

}

  set_location_value(){
    if(!(this.location_check_value)==true){
      this.location_value=" "  
    }
  }










}
