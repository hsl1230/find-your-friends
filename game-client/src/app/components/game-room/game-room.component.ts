import { Component, OnInit, OnDestroy } from '@angular/core';
import { GamingService } from 'src/app/services/gaming.service';
import { Subscription } from 'rxjs';
import { GameRoom } from 'src/app/models';
import { AuthenticationService } from 'src/app/services';

@Component({
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.scss']
})
export class GameRoomComponent implements OnInit, OnDestroy {
  currentGameRoom: GameRoom;
  cards: number[];
  private _roomSub: Subscription;
  private _cardsSub: Subscription;

  constructor(
    private gamingService: GamingService,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this._roomSub = this.gamingService.currentGameRoom.subscribe(game => {
      console.log('====game', game);
      this.currentGameRoom = game;
    });
    this._cardsSub = this.gamingService.cards.subscribe(cards => {
      this.cards = cards;
    });
  }

  ngOnDestroy(): void {
    this._roomSub.unsubscribe();
    this._cardsSub.unsubscribe();
  }

  startGame() {
    this.gamingService.startGame(this.currentGameRoom.roomId, this.authenticationService.currentUserValue.username);
  }
}
