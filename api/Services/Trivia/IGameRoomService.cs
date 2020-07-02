using System.Collections.Generic;
using api.Models;

namespace api.Services.Trivia
{
    public interface IGameRoomService
    {
        List<Game> GetGameRooms();
        public Game GetGameRoom(string roomname);
        public void SetRoundsForGameRoom(List<TriviumRound> rounds, string gameRoom);
    }
}