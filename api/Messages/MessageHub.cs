using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;
using api.Services.User;
using api.Services.Trivia;
using Microsoft.AspNetCore.SignalR;
using api.Dtos;

namespace api.Messages
{
    public class MessageHub : Hub
    {
        // private readonly IUserService _userService;
        private readonly IGameService _gameService;
        private readonly ITriviaService _triviaService;
        private readonly IGameRoomService _gameRoomService;

        public MessageHub(IGameService gameService, ITriviaService triviaService, IGameRoomService gameRoomService)
        {
            _gameRoomService = gameRoomService;
            _triviaService = triviaService;
            _gameService = gameService;
        }

        // public async Task SendMessage(string user, string message, string roomCode)
        // {
        //     _userService.AddUserToRoom(user, roomCode);

        //     await Clients.All.SendAsync("ReceiveMessage", user, message);
        // }

        public async Task AddToGroup(string roomCode)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomCode);

            _gameService.JoinOrCreateNewGameRoom(roomCode, Context.ConnectionId);

            _triviaService.InitializeTriviumGameRoom(4, roomCode);

            await Clients.Group(roomCode).SendAsync("Send", $"{Context.ConnectionId} has joined the group {roomCode}.");
        }

        public void AssociateUserWithId(string userName, string roomCode)
        {
            _gameService.AssociateUserNameWithId(userName, roomCode, Context.ConnectionId);
        }

        public async Task GetConnectedUsers(string roomCode)
        {
            List<Player> users = _gameService.GetUsersInRoom(roomCode);
            Console.WriteLine($"Returning connected users : ");
            if (users != null)
            {
                foreach (Player usr in users)
                {
                    Console.WriteLine($"{usr.Name}");
                }
            }
            await Clients.Group(roomCode).SendAsync(roomCode, users);
        }

        public async Task StartGame(string roomCode)
        {
            Console.WriteLine($"starting game for users in room {roomCode}");
            await Clients.Group(roomCode).SendAsync("StartGame");
        }

        public async Task PlayerAnswered(Player player, int answerId, int roundNumber, string roomCode)
        {
            // update game object with players answerId to the question in roundNumber
            Console.WriteLine($"message received with deets: {player} {roomCode} {answerId} {roundNumber}");
            // Console.WriteLine($"message received with deets: {player.Name} {answer} {roundNumber}");
            PlayerAnswerDto padto = new PlayerAnswerDto();
            // padto.Player.Name = player;
            padto.Player = player;
            padto.RoomCode = roomCode;
            padto.AnswerId = answerId;
            padto.RoundNumber = roundNumber;
            _gameRoomService.PlayerAnswered(padto);

            await Clients.Group(roomCode).SendAsync("AnswerSubmitted");

            // if number of players answered == number of players in game, call EndRound
            if (_gameRoomService.HaveAllPlayersAnswered(roomCode, roundNumber))
            {
                Console.WriteLine("all players have answered, ending round");
                await EndRound(roomCode, roundNumber);
            }
        }

        public async Task GetUsersWhoAnswered(string roomCode, int roundNumber)
        {
            await Clients.Group(roomCode).SendAsync("UsersWhoAnswered",
            _gameRoomService.GetPlayersWhoAnsweredInRound(roomCode, roundNumber));
        }

        public async Task EndRound(string roomCode, int roundNumber)
        {
            await Clients.Group(roomCode).SendAsync("RoundEndedShowScore");
        }

        public async Task RoundTimeUp(string roomCode, int roundNumber)
        {
            _gameRoomService.SetRoundComplete(roomCode, roundNumber);
            await EndRound(roomCode, roundNumber);
        }

        public async Task FetchRoundResults(string roomCode, int roundNumber)
        {
            Console.WriteLine("getting round results to return to the front");
            RoundResultsDto roundResults = _gameRoomService.GetRoundResults(roomCode, roundNumber);
            Console.WriteLine($"round results - {roundResults}");
            if (roundResults != null)
            {
                await Clients.Group(roomCode).SendAsync("RoundResults", roundResults);
            }
        }
    }
}