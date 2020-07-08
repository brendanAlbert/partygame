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
        private readonly IGameService _gameService;
        private readonly ITriviaService _triviaService;
        private readonly IGameRoomService _gameRoomService;

        public MessageHub(IGameService gameService, ITriviaService triviaService, IGameRoomService gameRoomService)
        {
            _gameRoomService = gameRoomService;
            _triviaService = triviaService;
            _gameService = gameService;
        }

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
            await Clients.Group(roomCode).SendAsync(roomCode, users);
        }

        public async Task StartGame(string roomCode)
        {
            await Clients.Group(roomCode).SendAsync("StartGame");
        }

        public async Task PlayerAnswered(Player player, int answerId, string roomCode)
        {
            // update game object with players answerId to the question in roundNumber
            Console.WriteLine($"message received with deets: {player} {roomCode} {answerId}");
            // Console.WriteLine($"message received with deets: {player.Name} {answer} {roundNumber}");
            PlayerAnswerDto padto = new PlayerAnswerDto();
            // padto.Player.Name = player;
            padto.Player = player;
            padto.RoomCode = roomCode;
            padto.AnswerId = answerId;
            // padto.RoundNumber = roundNumber;
            _gameRoomService.PlayerAnswered(padto);

            // await Clients.Group(roomCode).SendAsync("AnswerSubmitted");
            List<PlayerDto> players_whove_answered = _gameRoomService.GetPlayersWhoAnsweredInRound(roomCode);
            foreach (PlayerDto p in players_whove_answered)
            {
                Console.WriteLine($"{p.Name} has answered");
            }
            await Clients.Group(roomCode).SendAsync("UsersWhoAnswered", players_whove_answered);

            // if number of players answered == number of players in game, call EndRound
            if (_gameRoomService.HaveAllPlayersAnswered(roomCode))
            {
                Console.WriteLine($"all players have answered, ending round");
                _gameRoomService.SetRoundComplete(roomCode);
                await Clients.Group(roomCode).SendAsync("RoundEndedShowScore");
            }
        }

        // public async Task EndRound(string roomCode)
        // {
        //     // if (!_gameRoomService.IsRoundComplete(roomCode))
        //     // {
        //     _gameRoomService.SetRoundComplete(roomCode);
        //     await Clients.Group(roomCode).SendAsync("RoundEndedShowScore");

        //     // }
        // }

        public async Task FetchNextRound(string roomCode)
        {
            if (!_gameRoomService.GameIsOver(roomCode))
            {
                TriviumRoundDto triviumRoundDto = _gameRoomService.FetchNextRound(roomCode);
                foreach (var wt in triviumRoundDto.WrongTrivia)
                {
                    Console.WriteLine($"trivia = {wt.Answer}");
                }
                await Clients.Group(roomCode).SendAsync("FetchedNextRound", triviumRoundDto);
            }
            else
            {
                Console.WriteLine("game is over!");
            }
        }

        public async Task FetchRoundResults(string roomCode)
        {
            if (!_gameRoomService.GameIsOver(roomCode))
            {
                Console.WriteLine("Have this rooms results been fetched for this round?");
                bool fetched = _gameRoomService.HasRoundBeenFetched(roomCode);
                if (!fetched)
                {
                    Console.WriteLine("Not yet fetched , getting round results to return to the front");
                    RoundResultsDto roundResults = _gameRoomService.GetRoundResults(roomCode);
                    await Clients.Group(roomCode).SendAsync("RoundResults", roundResults);
                }
                else
                {
                    Console.WriteLine("This round's results have already been fetched.");
                }
            }
            else
            {
                Console.WriteLine("Game is over");
            }
        }
    }
}