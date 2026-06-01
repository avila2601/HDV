import { Routes } from '@angular/router';
import { CvComponent } from './cv/cv.component';
import { CvindustrialComponent } from './cvindustrial/cvindustrial.component';

export const routes: Routes = [
  { path: '', component: CvindustrialComponent },
  { path: 'cv-industrial', component: CvindustrialComponent }
];
