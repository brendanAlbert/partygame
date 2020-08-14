using System;
using System.Collections.Generic;
using api.Models;

namespace api.Services.Draw
{
    public class DrawGameRoomService : IDrawGameRoomService
    {
        private List<DrawGame> drawGameRooms;

        public DrawGameRoomService()
        {
            drawGameRooms = new List<DrawGame>();
        }

        public void AddNewDrawGameRoom(DrawGame drawGame)
        {
            drawGameRooms.Add(drawGame);
            Console.WriteLine($"Inside AddNewDrawGameRoom , new drawgame room added with name {drawGame.RoomName}");
        }

        public void DeleteDrawGameRoom(string room)
        {
            int indexToRemove = this.drawGameRooms.FindIndex(rm => rm.RoomName == room);
            this.drawGameRooms.RemoveAt(indexToRemove);
        }

        public List<DrawGame> GetDrawGameRooms()
        {
            return drawGameRooms;
        }

        public void PurgeOldGameRooms()
        {
            // purge game rooms older than an hour
            // Console.WriteLine("Checking to see if there are rooms to purge.");
            TimeSpan olderThanHour = new TimeSpan(0, 1, 0, 0);
            TimeSpan olderThanMinute = new TimeSpan(0, 0, 1, 0);
            int numberRoomsRemoved = this.drawGameRooms.RemoveAll(rm => ((rm.TimeCreated - DateTime.Now) * -1) > olderThanHour);
            if (numberRoomsRemoved > 0)
            {
                Console.WriteLine($"Purged {numberRoomsRemoved} room(s)");
            }
        }
    }
}