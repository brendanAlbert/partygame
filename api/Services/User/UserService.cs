using System;
using System.Collections.Generic;
using System.Linq;

namespace api.Services.User
{
    public class UserService : IUserService
    {
        // Dictionary<string, List<string>> gameRooms = new Dictionary<string, List<string>>();
        List<string> gameRoom = new List<string>();
        string[] users;
        string dbTextFile = "temp_db.txt";

        public List<string> GetRoomsUsers(string roomCode)
        {
            // return gameRooms[roomCode];
            users = System.IO.File.ReadAllLines(dbTextFile);
            foreach (string user in users)
            {
                gameRoom.Add(user);
            }
            return gameRoom;
        }

        public void AddUserToRoom(string user, string roomCode)
        {
            // List<string> users = new List<string>();

            // if (gameRooms.ContainsKey(roomCode))
            // {
            //     users = gameRooms[roomCode].Select(u => u).ToList();
            // }

            // Console.WriteLine($"adding {user} to room : {roomCode}");

            // users.Add(user);
            // gameRooms.Add(roomCode, users);
            using (System.IO.StreamWriter file = new System.IO.StreamWriter(dbTextFile, true))
            {
                file.WriteLine(user);
            }

            // gameRoom.Add(user);
        }
    }
}