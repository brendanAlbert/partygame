using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Services.Trivia
{
    public class GameRoomService : IGameRoomService
    {
        List<Game> gameRooms = new List<Game>();
        public List<Game> GetGameRooms()
        {
            return gameRooms;
        }

        public Game GetGameRoom(string roomname)
        {
            return gameRooms.First(rm => rm.RoomName == roomname);
        }

        public void SetRoundsForGameRoom(List<TriviumRound> rounds, string roomName)
        {
            gameRooms.First(rm => rm.RoomName == roomName).TriviumRounds = rounds;
        }
    }
}