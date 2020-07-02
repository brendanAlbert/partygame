using System;
using System.Collections.Generic;
using System.Linq;
using api.Data;
using api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace api.Services.Trivia
{
    public class GameService : IGameService
    {
        private readonly ITriviaService _triviaService;

        private readonly IGameRoomService _gameRoomService;
        public GameService(ITriviaService triviaService, IGameRoomService gameRoomService)
        {
            _triviaService = triviaService;
            _gameRoomService = gameRoomService;
        }

        public void AssociateUserNameWithId(string username, string roomCode, string connectionId)
        {
            _gameRoomService.GetGameRooms()
                .First(rm => rm.RoomName == roomCode).Players
                .First(p => p.ConnectionId == connectionId).Name = username;
        }

        public List<Player> GetUsersInRoom(string roomCode)
        {
            Game room = _gameRoomService.GetGameRooms().FirstOrDefault(rm => rm.RoomName == roomCode);
            List<Player> lp = room.Players;
            // return gameRooms.FirstOrDefault(rm => rm.RoomName == roomCode).Players.ToList();
            return lp;
        }

        public void JoinOrCreateNewGameRoom(string roomCode, string connectionId)
        {
            // Player newPlayer = new Player();
            // does a game room with this room code exist yet?
            Game room = _gameRoomService.GetGameRooms().FirstOrDefault(room => room.RoomName == roomCode);
            if (room == null)
            {

                Player newPlayer = new Player();
                newPlayer.IsAdmin = true;
                newPlayer.ConnectionId = connectionId;

                Game newGame = new Game();
                newGame.RoomName = roomCode;
                newGame.Players.Add(newPlayer);


                // newGame.TriviumRounds = await _triviaService.GetTriviumRounds(4, roomCode);


                _gameRoomService.GetGameRooms().Add(newGame);
            }
            else
            {
                // UserHandler.Rooms[roomCode].Add(Context.ConnectionId, newPlayer);
                Player newPlayer = new Player();
                newPlayer.ConnectionId = connectionId;
                _gameRoomService.GetGameRooms().First(rm => rm.RoomName == roomCode).Players.Add(newPlayer);

            }
        }

        // public void AddConnectionIdToRoom(string connectionId, string roomCode)
        // {
        //     Player newPlayer = new Player();
        //     Game gameRoom = gameRooms.First( rm => rm.RoomName == roomCode);
        //     newPlayer.ConnectionId = connectionId;
        //     gameRoom.Players.Add(newPlayer);
        // }

        // getscores


    }
}