import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoxesComponent } from './boxes/boxes.component';
import { BoxDetailComponent } from './box-detail/box-detail.component';
import { LoginComponent } from './login.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'boxes', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'boxes', component: BoxesComponent, canActivate: [AuthGuard] },
  { path: 'boxes/:boxId', component: BoxDetailComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'boxes' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
