import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from './components/layout/layout';

const routes: Routes = [
  {path:'', redirectTo:'q', pathMatch:'full'},
  {path:'q', component:Layout}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
