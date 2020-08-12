using System.Collections.Generic;
using api.Models;

namespace api.Services.Draw
{
    public interface IDrawService
    {
        public void JoinOrCreateNewGameRoom(string roomCode, string connectionString);
        public List<DrawPlayer> GetUsersInRoom(string roomCode);
        public List<string> GetAllDrawGameRooms();
        public void AssociateUserWithId(string userName, string roomCode, string connectionId, string id);
        public void AssociateUserWithUrl(string userName, string roomCode, string connectionId, string imgUrl);
        public void KeepAvatar(string userName, string roomCode, string connectionId, string imgUrl);
        public string FetchPrompt(string room);

        public DrawGame GetDrawGame(string room);

        public void DeleteDrawGame(string room);
    }
}