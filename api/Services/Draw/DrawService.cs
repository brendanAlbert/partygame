using System;
using System.Collections.Generic;
using System.IO;
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


                drawPlayer.ImageUrl = newDrawGame.PopRandomPlaceholderImage();

                _drawGameRoomService.AddNewDrawGameRoom(newDrawGame);
                Console.WriteLine($"New drawgame room added with name {roomCode}");
            }
            else
            {
                Tuple<string, string> colorPair = _drawGameRoomService.GetDrawGameRooms()
                    .FirstOrDefault(rm => rm.RoomName == roomCode).GetColorPair();

                drawPlayer.Color1 = colorPair.Item1;
                drawPlayer.Color2 = colorPair.Item2;

                drawPlayer.ImageUrl = drawGameRoom.PopRandomPlaceholderImage();

                _drawGameRoomService.GetDrawGameRooms()
                    .FirstOrDefault(rm => rm.RoomName == roomCode).DrawPlayers.Add(drawPlayer);
            }
        }

        public List<string> GetAllDrawGameRooms()
        {
            _drawGameRoomService.PurgeOldGameRooms();
            return _drawGameRoomService.GetDrawGameRooms().Select(rm => rm.RoomName).ToList();
        }

        public void AssociateUserWithId(string userName, string roomCode, string connectionId, string id)
        {
            roomCode = roomCode.ToUpper();

            _drawGameRoomService.GetDrawGameRooms()
               .First(rm => rm.RoomName == roomCode)
               .DrawPlayers
               .First(player => player.ConnectionString == connectionId).Name = userName;

            _drawGameRoomService.GetDrawGameRooms()
               .First(rm => rm.RoomName == roomCode)
               .DrawPlayers
               .First(player => player.ConnectionString == connectionId).Id = id;
        }

        public void AssociateUserWithUrl(string userName, string roomCode, string connectionId, string imgurl)
        {
            // Console.WriteLine($"img url passed into Associate User With Id Method: {imgUrl}");
            roomCode = roomCode.ToUpper();
            _drawGameRoomService.GetDrawGameRooms()
                .First(rm => rm.RoomName == roomCode)
                .DrawPlayers
                .First(player => player.ConnectionString == connectionId).ImageUrl = imgurl;
            _drawGameRoomService.GetDrawGameRooms()
            .First(rm => rm.RoomName == roomCode)
            .DrawPlayers
            .First(player => player.ConnectionString == connectionId).ReadyToStart = true;
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

        public void KeepAvatar(string userName, string roomCode, string connectionId, string imgUrl)
        {
            roomCode = roomCode.ToUpper();
            _drawGameRoomService.GetDrawGameRooms()
                .First(rm => rm.RoomName == roomCode)
                .DrawPlayers
                .First(player => player.ConnectionString == connectionId).ImageUrl = imgUrl;
            _drawGameRoomService.GetDrawGameRooms()
            .First(rm => rm.RoomName == roomCode)
            .DrawPlayers
            .First(player => player.ConnectionString == connectionId).ReadyToStart = true;
        }

        public void DeleteDrawGame(string room)
        {
            room = room.ToUpper();

            _drawGameRoomService.DeleteDrawGameRoom(room);

            // we also want to remove all images and prompts that include this room name

            // TimeSpan olderThanHour = new TimeSpan(0, 1, 0, 0);
            TimeSpan olderThanOneMinute = new TimeSpan(0, 0, 1, 0);
            TimeSpan olderThan20Minutes = new TimeSpan(0, 0, 20, 0);

            // to remove player images
            var folderName = Path.Combine("wwwroot", "Resources", "Images");
            var pathToGet = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            DirectoryInfo d = new DirectoryInfo($"{pathToGet}");
            // Console.WriteLine($"path to Get = {pathToGet}");
            FileInfo[] playerImages = d.GetFiles("*.png");

            foreach (FileInfo file in playerImages)
            {

                if (file.Name.Contains("_placeholder") == false)
                {
                    Console.WriteLine($"DateTime.Now - File.GetLastAccessTime(file.FullName) > olderThan20Minutes  = {DateTime.Now - File.GetLastAccessTime(file.FullName) > olderThan20Minutes}");
                    if (DateTime.Now - File.GetLastAccessTime(file.FullName) > olderThan20Minutes)
                    {
                        Console.WriteLine($"DateTime.Now  = {DateTime.Now}");
                        Console.WriteLine($"File.GetLastAccessTime(file.FullName) = {File.GetLastAccessTime(file.FullName)}");
                        Console.WriteLine($"older than 20 minutes  = {olderThan20Minutes}");
                        // Console.WriteLine($"deleting file [{file.Name}] because it is over a minute old");
                        Console.WriteLine($"deleting file [{file.Name}] because it is over 20 minutes old");
                        File.Delete(file.ToString());
                    }
                    else if (file.Name.Contains("_" + room))
                    {
                        Console.WriteLine($"deleting file [{file.Name}] because it was for a room that no longer exists {room}.");
                        if (file.Name.Contains("_placeholder") == false)
                        {
                            File.Delete(file.ToString());
                        }
                    }
                }

            }

            // to remove prompt images
            var promptfolderName = Path.Combine("wwwroot", "Resources", "PromptImgs");
            var promptpathToGet = Path.Combine(Directory.GetCurrentDirectory(), promptfolderName);
            DirectoryInfo promptDir = new DirectoryInfo($"{promptpathToGet}");
            FileInfo[] Files = promptDir.GetFiles("*.png");



            foreach (FileInfo file in Files)
            {

                if (DateTime.Now - File.GetLastAccessTime(file.FullName) > olderThan20Minutes)
                {
                    Console.WriteLine($"would delete file [{file.Name}] because it is over 20 minutes old");
                    // Console.WriteLine($"deleting file [{file.Name}] because it is over an hour old");
                    File.Delete(file.ToString());
                }
                else if (file.Name.Contains(room + "_prompt"))
                {
                    Console.WriteLine($"deleting file [{file.Name}] because it was for a room that no longer exists {room}.");
                    File.Delete(file.ToString());
                }

            }


            // remove any other images that aren't the placeholder which are older than an hour

            Console.WriteLine($"I think I successfully removed game room {room} and its associated images");
        }
    }
}