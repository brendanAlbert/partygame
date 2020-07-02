using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;
using api.Services.User;
using api.Services.Trivia;
using Microsoft.AspNetCore.SignalR;

namespace api.Messages
{
    public class MessageHub : Hub
    {
        // private readonly IUserService _userService;
        private readonly IGameService _gameService;
        private readonly ITriviaService _triviaService;

        public MessageHub(IGameService gameService, ITriviaService triviaService)
        {
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
    }
}