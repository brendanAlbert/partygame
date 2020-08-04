using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Services.Draw
{
    public class DrawService : IDrawService
    {
        private IDrawGameRoomService _drawGameRoomService;
        public DrawService(IDrawGameRoomService drawGameRoomService)
        {
            _drawGameRoomService = drawGameRoomService;
        }

        public List<DrawPlayer> GetUsersInRoom(string roomCode)
        {
            roomCode = roomCode.ToUpper();

            return _drawGameRoomService.GetDrawGameRooms()
                .FirstOrDefault(rm => rm.RoomName == roomCode)
                .DrawPlayers;
        }

        private DrawGame InstantiateNewDrawGameRoom(string roomCode, DrawPlayer drawPlayer)
        {
            DrawGame newDrawGame = new DrawGame();
            newDrawGame.RoomName = roomCode;

            Tuple<string, string> colorPair = newDrawGame.GetColorPair();

            drawPlayer.Color1 = colorPair.Item1;
            drawPlayer.Color2 = colorPair.Item2;

            newDrawGame.DrawPlayers.Add(drawPlayer);
            return newDrawGame;
        }

        public void JoinOrCreateNewGameRoom(string roomCode, string connectionString)
        {
            roomCode = roomCode.ToUpper();

            DrawGame drawGameRoom = _drawGameRoomService.GetDrawGameRooms()
                .FirstOrDefault(rm => rm.RoomName == roomCode);

            DrawPlayer drawPlayer = new DrawPlayer();
            drawPlayer.ConnectionString = connectionString;
            drawPlayer.Score = 0;

            if (drawGameRoom == null)
            {
                drawPlayer.IsAdmin = true;

                DrawGame newDrawGame = InstantiateNewDrawGameRoom(roomCode, drawPlayer);



                _drawGameRoomService.AddNewDrawGameRoom(newDrawGame);
                Console.WriteLine($"New drawgame room added with name {roomCode}");
            }
            else
            {
                Tuple<string, string> colorPair = _drawGameRoomService.GetDrawGameRooms()
                    .FirstOrDefault(rm => rm.RoomName == roomCode).GetColorPair();

                drawPlayer.Color1 = colorPair.Item1;
                drawPlayer.Color2 = colorPair.Item2;

                _drawGameRoomService.GetDrawGameRooms()
                    .FirstOrDefault(rm => rm.RoomName == roomCode).DrawPlayers.Add(drawPlayer);
            }
        }

        public List<string> GetAllDrawGameRooms()
        {
            return _drawGameRoomService.GetDrawGameRooms().Select(rm => rm.RoomName).ToList();
        }

        public void AssociateUserWithId(string userName, string roomCode, string connectionId, string imgUrl)
        {
            roomCode = roomCode.ToUpper();

            var rooms = _drawGameRoomService.GetDrawGameRooms()
               .First(rm => rm.RoomName == roomCode)
               .DrawPlayers
               .First(player => player.ConnectionString == connectionId).Name = userName;

            Console.WriteLine($"img url passed into Associate User With Id Method: {imgUrl}");
            _drawGameRoomService.GetDrawGameRooms()
                .First(rm => rm.RoomName == roomCode)
                .DrawPlayers
                .First(player => player.ConnectionString == connectionId).ImageUrl = imgUrl;
        }

        public string FetchPrompt(string room)
        {
            string p = _drawGameRoomService.GetDrawGameRooms()
                            .First(rm => rm.RoomName == room).PopRandomPrompt();
            return p;
        }

        public DrawGame GetDrawGame(string room)
        {
            return _drawGameRoomService.GetDrawGameRooms().First(rm => rm.RoomName == room);
        }
    }
}