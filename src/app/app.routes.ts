import { Routes } from '@angular/router';
import { EditFormComponent } from './components/edit-form/edit-form.component';
import { FormComponent } from './components/form/form.component';

export const routes: Routes = [
  { path: '', component: FormComponent },
  { path: 'edit-form', component: EditFormComponent },
];
