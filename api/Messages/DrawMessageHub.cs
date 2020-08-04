using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using api.Models;
using api.Services.Draw;
using Microsoft.AspNetCore.SignalR;

namespace api.Messages
{
    public class DrawMessageHub : Hub
    {
        private readonly IDrawService _drawService;
        public DrawMessageHub(IDrawService drawService)
        {
            _drawService = drawService;
        }

        public async Task AddToDrawGroup(string roomCode)
        {
            roomCode = roomCode.ToUpper();

            await Groups.AddToGroupAsync(Context.ConnectionId, roomCode);

            _drawService.JoinOrCreateNewGameRoom(roomCode, Context.ConnectionId);

            await Clients.Group(roomCode).SendAsync("DrawSend", $"{Context.ConnectionId} has joined room {roomCode}");
        }

        public async Task GetConnectedDrawUsers(string roomCode)
        {
            roomCode = roomCode.ToUpper();

            List<DrawPlayer> drawPlayers = _drawService.GetUsersInRoom(roomCode);

            await Clients.Group(roomCode).SendAsync("connectedDrawUsers", drawPlayers);
        }

        public async Task GetActiveGameLobbies()
        {
            await Clients.All.SendAsync("ActiveLobbies", _drawService.GetAllDrawGameRooms());
        }

        public void AssociateUserWithId(string userName, string roomCode, string imgUrl)
        {
            roomCode = roomCode.ToUpper();

            Console.WriteLine($"img url passed into draw message hub: {imgUrl}");
            _drawService.AssociateUserWithId(userName, roomCode, Context.ConnectionId, imgUrl);
        }

        public async Task StartGame(string room)
        {
            room = room.ToUpper();

            Console.WriteLine($"sending out StartGame signal to room {room}");

            await Clients.Group(room).SendAsync("StartGame");
        }

        public async Task FetchPrompt(string room)
        {
            room = room.ToUpper();

            string prompt = _drawService.FetchPrompt(room);
            await Clients.Caller.SendAsync("FetchedPrompt", prompt);
        }


        public async Task ArtSubmission(string room, string url, string prompt)
        {
            room = room.ToUpper();
            _drawService.GetDrawGame(room)
            .AddArtSubmission(url, prompt);

            await Clients.Group(room).SendAsync("ArtAdded");
        }



        public async Task NewLobbyArrival(string room, DrawPlayer drawPlayer)
        {
            room = room.ToUpper();

            _drawService.GetDrawGame(room).FirstRoundLobby.Add(drawPlayer);

            List<DrawPlayer> players = _drawService.GetDrawGame(room).FirstRoundLobby;

            await Clients.Group(room).SendAsync("FetchedNewLobbyArrivals", players);
        }

        public async Task FetchRandomPromptRound(string room)
        {
            room = room.ToUpper();

            DrawGameRound dgr = _drawService.GetDrawGame(room).FetchRandomGameRound();

            var gameRoundDTO = new
            {
                url = dgr.ImageUrl
            };

            await Clients.Group(room).SendAsync("FetchedRandomPromptRound", gameRoundDTO);

        }

        public async Task AddUserGuessForPrompt(string room, DrawPlayer drawPlayer, string playersGuess)
        {
            room = room.ToUpper();

            List<DrawPlayer> playersWhoAnswered = _drawService.GetDrawGame(room).AddAnswerAndReturnPlayers(drawPlayer, playersGuess);

            await Clients.Group(room).SendAsync("FetchedNewPlayerGuesses", playersWhoAnswered);
        }

        public async Task FetchAllGuessesForPromptRound(string room)
        {
            room = room.ToUpper();

            List<string> allAnswers = _drawService.GetDrawGame(room).GetAllAnswersCurrentRound();

            await Clients.Group(room).SendAsync("FetchedAllGuessesForPromptRound", allAnswers);
        }

        public async Task AddPlayerToListWaitingToSeeResults(string room, DrawPlayer drawPlayer, string chosenAnswer)
        {
            room = room.ToUpper();

            _drawService.GetDrawGame(room).AddPlayerToWaiting(drawPlayer, chosenAnswer);

            List<DrawPlayer> playersWaiting = _drawService.GetDrawGame(room).GetPlayersWaiting();

            await Clients.Group(room).SendAsync("FetchPlayersWaitingToSeeResults", playersWaiting);
        }

        public async Task TakePlayersToResultsScreen(string room)
        {
            room = room.ToUpper();

            await Clients.Group(room).SendAsync("HeadToResultsScreen");
        }
    }
}