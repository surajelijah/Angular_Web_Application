import { HttpHandler } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  display_content_val: number =0
  localstorage_count:any
  tables_values:any
  display_component(eventdata :any){

    console.log(eventdata.srcElement.innerHTML)

    let clicked_value : string = eventdata.srcElement.innerHTML

    if(clicked_value === "Search")
      this.display_content_val=0
    else{
      this.display_content_val=1

      this.handle_favorite_display()

      
    }
  }

  handle_favorite_display(){

    this.localstorage_count=localStorage.length
      if(this.localstorage_count!=0){
        var table_values_arr=JSON.parse(JSON.stringify(localStorage))

        this.tables_values=[]
        for(var key in table_values_arr){
          this.tables_values.push(table_values_arr[key].split(','))
        }

        console.log(this.tables_values)
        console.log(typeof(this.tables_values))
      }

  }


  remove_favorite(event:any){

    console.log("Remove Favorite")
    console.log(event.srcElement.id)

    localStorage.removeItem(event.srcElement.id)
    this.handle_favorite_display()

  }


}
