using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos;
using api.Models;

namespace api.Services.Trivia
{
    public class GameRoomService : IGameRoomService
    {
        List<Game> gameRooms = new List<Game>();
        public List<Game> GetGameRooms()
        {
            return gameRooms;
        }

        public Game GetGameRoom(string roomname)
        {
            return gameRooms.First(rm => rm.RoomName == roomname);
        }

        public void SetRoundsForGameRoom(List<TriviumRound> rounds, string roomName)
        {
            gameRooms.First(rm => rm.RoomName == roomName).TriviumRounds = rounds;
        }

        public void PlayerAnswered(PlayerAnswerDto playerAnswerDto)
        {
            Console.WriteLine(gameRooms.First(rm => rm.RoomName == playerAnswerDto.RoomCode).TriviumRounds[playerAnswerDto.RoundNumber].Answerers);
            PlayerDto pdto = new PlayerDto()
            {
                Name = playerAnswerDto.Player.Name,
                AnswerId = playerAnswerDto.AnswerId,
                Score = gameRooms.First(rm => rm.RoomName == playerAnswerDto.RoomCode)
                    .Players.First(p => p.Name == playerAnswerDto.Player.Name).Score
            };
            gameRooms.First(rm => rm.RoomName == playerAnswerDto.RoomCode)
                .TriviumRounds[playerAnswerDto.RoundNumber]
                .Answerers.Add(pdto);

            if (gameRooms.First(rm => rm.RoomName == playerAnswerDto.RoomCode)
                .TriviumRounds[playerAnswerDto.RoundNumber].AnswerTrivium.Id == playerAnswerDto.AnswerId)
            {
                // player got it right, update her score
                gameRooms.First(rm => rm.RoomName == playerAnswerDto.RoomCode)
                    .Players.First(p => p.Name == playerAnswerDto.Player.Name).Score += 100;

                gameRooms.First(rm => rm.RoomName == playerAnswerDto.RoomCode)
                    .TriviumRounds[playerAnswerDto.RoundNumber]
                    .Answerers.First(a => a.Name == playerAnswerDto.Player.Name).Score += 100;

            }

            if (gameRooms.First(rm => rm.RoomName == playerAnswerDto.RoomCode).TriviumRounds[playerAnswerDto.RoundNumber].Answerers.Count == gameRooms.First(rm => rm.RoomName == playerAnswerDto.RoomCode).Players.Count)
            {
                SetRoundComplete(playerAnswerDto.RoomCode, playerAnswerDto.RoundNumber);
            }
            // List<Player> lp = gameRooms.First(rm => rm.RoomName == playerAnswerDto.RoomCode).Players.ToList();
            // foreach (var p in lp)
            // {
            //     Console.WriteLine($"{p.Name} - {p.Score}");
            // }
        }

        public bool HaveAllPlayersAnswered(string roomCode, int roundNumber)
        {
            // if # players answered in current round == # players return true
            return gameRooms.First(rm => rm.RoomName == roomCode).TriviumRounds[roundNumber].RoundComplete;
        }

        public List<PlayerDto> GetPlayersWhoAnsweredInRound(string roomCode, int roundNumber)
        {
            return gameRooms.First(rm => rm.RoomName == roomCode).TriviumRounds[roundNumber].Answerers;
        }

        public void SetRoundComplete(string roomCode, int roundNumber)
        {
            gameRooms.First(rm => rm.RoomName == roomCode).TriviumRounds[roundNumber].RoundComplete = true;
        }
        public bool IsRoundComplete(string roomCode, int roundNumber)
        {
            return gameRooms.First(rm => rm.RoomName == roomCode).TriviumRounds[roundNumber].RoundComplete;
        }

        public RoundResultsDto GetRoundResults(string roomCode, int roundNumber)
        {

            TriviumRound triviumRound = gameRooms.First(rm => rm.RoomName == roomCode).TriviumRounds[roundNumber];
            RoundResultsDto triviumRoundDto = new RoundResultsDto();

            List<PlayerDto> players = gameRooms.First(rm => rm.RoomName == roomCode).TriviumRounds[roundNumber].Answerers.ToList();

            triviumRoundDto.Players = players;


            // here we need to associate the answerId with the text verison of the answers

            triviumRoundDto.Question = gameRooms.First(rm => rm.RoomName == roomCode).TriviumRounds[roundNumber].AnswerTrivium.Question;

            Trivium answerTrivium = gameRooms.First(rm => rm.RoomName == roomCode).TriviumRounds[roundNumber].AnswerTrivium;
            triviumRoundDto.Answer = answerTrivium.Answer;

            List<Trivium> lt = gameRooms.First(rm => rm.RoomName == roomCode).TriviumRounds[roundNumber].WrongTrivia;

            foreach (PlayerDto p in players)
            {
                foreach (Trivium t in lt)
                {
                    if (p.AnswerId == t.Id)
                    {
                        p.Answer = t.Answer;
                    }
                    triviumRoundDto.OtherAnswers.Add(t.Answer);
                }
                if (p.AnswerId == answerTrivium.Id)
                {
                    p.Answer = answerTrivium.Answer;
                }
            }



            gameRooms.First(rm => rm.RoomName == roomCode).TriviumRounds[roundNumber].Fetched = true;
            return triviumRoundDto;

        }
    }
}