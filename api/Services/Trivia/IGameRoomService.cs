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
        public List<PlayerDto> GetPlayersWhoAnsweredInRound(string roomCode);
        public bool HaveAllPlayersAnswered(string roomCode);
        public void SetRoundComplete(string roomCode);
        public bool IsRoundComplete(string roomCode);
        public RoundResultsDto GetRoundResults(string roomCode);
        public TriviumRoundDto FetchNextRound(string roomCode);
        public bool HasRoundBeenFetched(string roomCode);
        public bool GameIsOver(string roomCode);
        public void MakeGameRoomAvailableAgain(string roomCode);
    }
}