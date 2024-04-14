import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FavoritesDisplayComponent } from './favorites-display/favorites-display.component';
import { SearchFormComponent } from './search-form/search-form.component';

const routes: Routes = [

  { path:'search',component : SearchFormComponent},
  {  path: 'favorites',component: FavoritesDisplayComponent },
  {  path: '',redirectTo:'search',pathMatch:'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
