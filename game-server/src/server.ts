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

            let player = gameRoom.getPlayerByClientId(socket.client.id);
            if (player) {
                player.clientId = socket.client.id;
            } else {
                player = gameRoom.getPlayer(roomInfo.playerId);
                if (!player) {
                    gameRoom.addPlayer(roomInfo.playerId, socket.client.id);
                }
            }

            console.log('=====emit room-game', gameRoom);
            socket.emit('game-room', gameRoom);
            socket.to(gameRoom.roomId).emit('game-room', gameRoom);
        }
    });

    socket.on('start-game', roomInfo => {
        console.log('====start game', roomInfo);
        safeJoinRoom(roomInfo.roomId);

        let roomGame = roomGames.find(game => game.gameRoom.roomId === roomInfo.roomId);
        if (!roomGame) {
            const gameRoom = gameRooms.find(game => game.roomId === roomInfo.roomId);
            if (gameRoom) {
                roomGame = new RoomGame(gameRoom);
                roomGames.push(roomGame);
            }
        }

        if (roomGame) {
            if (!roomGame.currentGame) {
                roomGame.nextGame();
            }

            if (roomGame.currentGame) {
                const gamePlayer = roomGame.currentGame.getGamePlayer(socket.client.id);
                if (gamePlayer) {
                    console.log('====start game', gamePlayer.cards);
                    socket.emit('game-player', gamePlayer);
                }
            }
        }
    });

    socket.on('set-suit', roomInfo => {
        const roomGame = roomGames.find(game => game.gameRoom.roomId === roomInfo.roomId);
        if (roomGame && roomGame.currentGame) {
            const game = roomGame.currentGame;
            game.masterSuit = roomInfo.suit;
            roomGame.gameRoom.players.forEach(player => {
                const clientSocket = io.sockets.connected[player.clientId];
                const gamePlayer = game.getGamePlayer(player.clientId);
                clientSocket.emit('game-player', gamePlayer);
            });
        }
    });

    socket.on('play-cards', roomInfo => {
        const roomGame = roomGames.find(game => game.gameRoom.roomId === roomInfo.roomId);
        if (roomGame && roomGame.currentGame) {
            const game = roomGame.currentGame;
            game.playCards(socket.client.id, roomInfo.cards);
            roomGame.gameRoom.players.forEach(player => {
                const clientSocket = io.sockets.connected[player.clientId];
                const gamePlayer = game.getGamePlayer(player.clientId);
                clientSocket.emit('game-player', gamePlayer);
            });
        }
    });
});

httpServer.listen(8080, () => {
    console.log('Listening on port 8080');
});

/*
2,3,4,5,6,7,8,9,10,J,Q,K,A,king,KING
*/
