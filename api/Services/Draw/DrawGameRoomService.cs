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

        public List<DrawGame> GetDrawGameRooms()
        {
            return drawGameRooms;
        }


    }
}