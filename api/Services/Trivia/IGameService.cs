using System.Collections.Generic;
using api.Models;

namespace api.Services.Trivia
{
    public interface IGameService
    {
        void JoinOrCreateNewGameRoom(string roomCode, string connectionId);
        void AssociateUserNameWithId(string username, string roomCode, string connectionId);
        List<Player> GetUsersInRoom(string roomCode);
        // void AddConnectionIdToRoom(string connectionId, string roomCode);
        // void AddRoomNumber(string roomName);
        // void AddPlayer(Player player);
        // Player GetPlayer(string playerName);
        // List<Player> GetPlayers();
        // void UpdatePlayerScore(Player player1, int score);
    }
}