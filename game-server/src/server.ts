import app from 'express';
import http from 'http';
import socketIo from 'socket.io';
import { GameRoom } from './game-room';
import { RoomGame } from './room-game';

const httpServer = new http.Server(app);
const io = socketIo(httpServer);

const gameRooms: GameRoom[] = [];
const roomGames: RoomGame[] = [];

io.on('connection', socket => {
    let previousRoomId: string;
    const safeJoinRoom = (currentRoomId: string) => {
        if (currentRoomId !== previousRoomId) {
            if (previousRoomId) {
                socket.leave(previousRoomId);
            }
            socket.join(currentRoomId);
            previousRoomId = currentRoomId;
        }
    }

    socket.on('create-game-room', roomInfo => {
        const gameRoom = new GameRoom(roomInfo.startLevel, roomInfo.numberOfPlayers, roomInfo.setsOfPoker, roomInfo.roomName);
        gameRooms.push(gameRoom);
 
        safeJoinRoom(gameRoom.roomId);

        socket.emit('game-room', gameRoom);
        io.emit('game-rooms', gameRooms);
    });

    socket.on('get-game-rooms', () => {
        socket.emit('game-rooms', gameRooms);
    })

    socket.on('join-in-room', roomInfo => {
        console.log('======join-in-room', roomInfo);
        const gameRoom = gameRooms.find(game => game.roomId === roomInfo.roomId);
        if (gameRoom) {
            safeJoinRoom(gameRoom.roomId);
            gameRoom.addPlayer(roomInfo.playerId);
            console.log('=====emit room-game', gameRoom);
            socket.emit('game-room', gameRoom);
            socket.to(gameRoom.roomId).emit('game-room', gameRoom);
        }
    });

    socket.on('start-game', roomInfo => {
        const gameRoom = gameRooms.find(game => game.roomId === roomInfo.roomId);
        if (gameRoom) {
            const roomGame = new RoomGame(gameRoom);
            roomGames.push(roomGame);
            if (roomGame) {
                safeJoinRoom(roomGame.gameRoom.roomId);
                roomGame.nextGame();
                if (roomGame.currentGame) {
                    const gamePlayer = roomGame.currentGame.getGamePlayer(roomInfo.playerId);
                    if (gamePlayer) {
                        socket.emit('cards', gamePlayer.cards);
                    }
                } 
            }    
        }
    })

    socket.on('get-cards', roomInfo => {
        const roomGame = roomGames.find(game => game.gameRoom.roomId === roomInfo.roomId);
        if (roomGame && roomGame.currentGame) {
            const gamePlayer = roomGame.currentGame.getGamePlayer(roomInfo.playerId);
            if (gamePlayer) {
                socket.emit('cards', gamePlayer.cards);
            }
        } 
    });

    socket.on('play-cards', roomInfo => {
        const roomGame = roomGames.find(game => game.gameRoom.roomId === roomInfo.roomId);
        if (roomGame && roomGame.currentGame) {
            const gamePlayer = roomGame.currentGame.gamePlayers.find(player => player.player.playerId === roomInfo.playerId);
            if (gamePlayer) {
                gamePlayer.play(roomInfo.cards);
                socket.to(roomGame.gameRoom.roomId).emit('game-player', gamePlayer);
            }
        }
    })
});

httpServer.listen(8080, () => {
    console.log('Listening on port 8080');
});

/*
2,3,4,5,6,7,8,9,10,J,Q,K,A,king,KING
*/
