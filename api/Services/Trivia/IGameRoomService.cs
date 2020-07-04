using System.Collections.Generic;
using api.Dtos;
using api.Models;

namespace api.Services.Trivia
{
    public interface IGameRoomService
    {
        List<Game> GetGameRooms();
        public Game GetGameRoom(string roomname);
        public void SetRoundsForGameRoom(List<TriviumRound> rounds, string gameRoom);
        public void PlayerAnswered(PlayerAnswerDto playerAnswerDto);
        public List<PlayerDto> GetPlayersWhoAnsweredInRound(string roomCode, int roundNumber);
        public bool HaveAllPlayersAnswered(string roomCode, int roundNumber);
        public void SetRoundComplete(string roomCode, int roundNumber);
        public bool IsRoundComplete(string roomCode, int roundNumber);
        public RoundResultsDto GetRoundResults(string roomCode, int roundNumber);
    }
}