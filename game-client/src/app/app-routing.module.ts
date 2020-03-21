import { NgModule } from '@angular/core';
﻿import { Routes, RouterModule } from '@angular/router';
import { HomeComponent, LoginComponent, RegisterComponent, GameRoomComponent } from './components';
import { AuthGuard } from './helpers';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'game-room', component: GameRoomComponent },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
