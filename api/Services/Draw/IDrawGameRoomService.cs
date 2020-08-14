using System.Collections.Generic;
using api.Models;

namespace api.Services.Draw
{
    public interface IDrawGameRoomService
    {
        public List<DrawGame> GetDrawGameRooms();
        public void AddNewDrawGameRoom(DrawGame drawGame);

        public void DeleteDrawGameRoom(string room);

        public void PurgeOldGameRooms();
    }
}