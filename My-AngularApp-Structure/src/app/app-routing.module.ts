import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CvFormComponent } from './modules/cv-form/cv-form.component';
import { UserListComponent } from './modules/user-list/user-list.component';
import { CvComponent } from './modules/cv/cv.component';

const routes: Routes = [
  { path: 'create-cv/:id', component: CvFormComponent },
  { path: 'cv-create', component: CvFormComponent },
  { path: 'users', component: UserListComponent },
  { path: 'cv', component: CvComponent },
  { path: '', redirectTo: '/users', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
