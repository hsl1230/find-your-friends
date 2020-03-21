import { Component, OnInit, OnDestroy } from '@angular/core';
import { GamingService } from 'src/app/services/gaming.service';
import { Subscription } from 'rxjs';
import { RoomGame } from 'src/app/models';

@Component({
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.scss']
})
export class GameRoomComponent implements OnInit, OnDestroy {
  currentRoomGame: RoomGame;
  private _roomSub: Subscription;

  constructor(private gamingService: GamingService) { }

  ngOnInit(): void {
    this._roomSub = this.gamingService.currentRoomGame.subscribe(game => {
      console.log('====game', game);
      this.currentRoomGame = game;
    });
  }

  ngOnDestroy(): void {
    this._roomSub.unsubscribe();
  }

  startGame() {
    this.gamingService.startGame(this.currentRoomGame.gameRoom.roomId);
  }
}
