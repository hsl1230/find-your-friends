import { Component, OnInit } from '@angular/core';

import { User, GameRoom } from '../../models';
import { AuthenticationService, GamingService } from '../../services';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    currentUser: User;
    gameRooms: Observable<GameRoom[]>;

    constructor(
      private gamingService: GamingService,
        private authenticationService: AuthenticationService,
        private router: Router,
    ) {
        this.currentUser = this.authenticationService.currentUserValue;
    }

    ngOnInit(): void {
      this.gamingService.getGameRooms();
      this.gameRooms = this.gamingService.gameRooms;
    }

    ngOnDestroy(): void {
    }

    joinInRoom(roomId: string) {
      this.gamingService.joinInRoom(roomId, this.currentUser.username);
      this.router.navigate(['game-room']);
    }

    createGameRoom() {
      this.gamingService.createGameRoom(this.currentUser.username, 'test-game-room', 11, 7, 3);
    }
}
