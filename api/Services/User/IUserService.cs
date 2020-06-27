using System.Collections.Generic;

namespace api.Services.User
{
    public interface IUserService
    {
        List<string> GetRoomsUsers(string roomCode);
        void AddUserToRoom(string user, string roomCode);
    }
}