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

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            Console.WriteLine($"Connection with id {Context.ConnectionId} has disconnected with exception : {exception}");

            /*
            I need to write custom reconnect logic.
            Basically, we need to store the connectionID for this room.


            on disconnect, we could remove the player with connection id from whichever room they were in although it would be hard to recover
            */
            Console.WriteLine(exception);
            await base.OnDisconnectedAsync(exception);
        }

        public override async Task OnConnectedAsync()
        {
            Console.WriteLine($"Connection with id {Context.ConnectionId} has been established!  We will want to save this in case they disconnect.");

            /*
            I need to write custom reconnect logic.
            Basically, we need to store the connectionID for this room.

            We will want to do something like store the original connection id in a cookie or localStorage.

            so if the user refreshes, on the client side we will check the localstorage for some unique key id pair
            i.e.    ['wrinkleid': 'some id']   maybe all we need to add is the roomcode

            if the cookie/localstore value exists, then reassociate this user with that DrawPlayer and navigate to the correct route/round?
            */
            await Groups.AddToGroupAsync(Context.ConnectionId, "SignalR Users");
            await base.OnConnectedAsync();
        }

        public async Task FetchMyPlaceholderImgUrl(string roomCode)
        {
            roomCode = roomCode.ToUpper();

            List<DrawPlayer> players = _drawService.GetUsersInRoom(roomCode);
            string urlString = "";
            foreach (DrawPlayer player in players)
            {
                if (player.ConnectionString == Context.ConnectionId)
                {
                    urlString = player.ImageUrl;
                    break;
                }
            }

            Console.WriteLine($"player with connection id {Context.ConnectionId} has imgUrl {urlString}");
            await Clients.Caller.SendAsync("FetchedYourImgUrl", urlString);
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

        public void AssociateUserWithId(string userName, string roomCode, string id)
        {
            roomCode = roomCode.ToUpper();

            _drawService.AssociateUserWithId(userName, roomCode, Context.ConnectionId, id);
        }
        public async Task AssociateUserWithUrl(string userName, string roomCode, string imgUrl)
        {
            roomCode = roomCode.ToUpper();

            _drawService.AssociateUserWithUrl(userName, roomCode, Context.ConnectionId, imgUrl);

            List<DrawPlayer> drawPlayers = _drawService.GetUsersInRoom(roomCode);

            await Clients.Group(roomCode).SendAsync("newPlayerReadyToStart", drawPlayers);
        }

        public void KeepAvatar(string userName, string roomCode, string url)
        {
            roomCode = roomCode.ToUpper();

            _drawService.KeepAvatar(userName, roomCode, Context.ConnectionId, url);
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

            drawPlayer.StillDrawing = false;

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

        public async Task CalculateAndFetchRoundResults(string room)
        {
            room = room.ToUpper();

            DrawGameRound dgr = _drawService.GetDrawGame(room).FetchGameRoundResults();

            PlayerAnswerHashMap hashMap = new PlayerAnswerHashMap();

            foreach (Tuple<DrawPlayer, string> tpl in dgr.ListPlayerAnswerTuples)
            {
                if (hashMap.Associations.ContainsKey(tpl.Item2))
                {
                    hashMap.Associations[tpl.Item2].Add(tpl.Item1);
                }
                else
                {
                    hashMap.Associations.Add(tpl.Item2, new List<DrawPlayer> { tpl.Item1 });
                }
            }

            if (!hashMap.Associations.ContainsKey(dgr.Answer))
            {
                hashMap.Associations.Add(dgr.Answer, new List<DrawPlayer> { });
            }

            var roundResultsDTO = new
            {
                url = dgr.ImageUrl,
                players = dgr.Players,
                playerAnswerHashMap = hashMap, // this tracks who voted for which answer
                guessAndItsSubmitter = dgr.ListPlayerAnswerSubmissions, // this associates guesses with their submitters to assign points
                answer = dgr.Answer,
                lastRound = dgr.LastRound
            };

            await Clients.Group(room).SendAsync("ReturningCalculatedAndFetchedRoundResults", roundResultsDTO);
        }

        public async Task GetNextRound(string room, List<DrawPlayer> drawPlayers)
        {
            room = room.ToUpper();

            _drawService.GetDrawGame(room).UpdatePlayersScores(drawPlayers);

            DrawGameRound dgr = _drawService.GetDrawGame(room).FetchRandomGameRound();

            var gameRoundDTO = new
            {
                url = dgr.ImageUrl
            };

            await Clients.Group(room).SendAsync("GotNextRound", gameRoundDTO);
        }

        public async Task ShowNextPromptResult(string room)
        {
            /* THIS METHOD IS FOR KEEPING ALL PLAYERS IN SYNC WHEN SHOWING WHO CHOSE WHICH ANSWER AND WHO GETS POINTS */
            room = room.ToUpper();



            await Clients.Group(room).SendAsync("ShowingNextPromptResult");
        }

        public async Task ShowFinalScore(string room)
        {
            room = room.ToUpper();


            // let's delete this game room
            _drawService.DeleteDrawGame(room);

            await Clients.Group(room).SendAsync("ShowingFinalScore");
        }
    }
}