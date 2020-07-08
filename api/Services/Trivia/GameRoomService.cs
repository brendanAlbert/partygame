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
            int roundNumber = gameRooms.First(rm => rm.RoomName == playerAnswerDto.RoomCode).RoundNumber;
            Console.WriteLine(gameRooms.First(rm => rm.RoomName == playerAnswerDto.RoomCode).TriviumRounds[roundNumber].Answerers);
            PlayerDto pdto = new PlayerDto()
            {
                Name = playerAnswerDto.Player.Name,
                AnswerId = playerAnswerDto.AnswerId,
                Score = gameRooms.First(rm => rm.RoomName == playerAnswerDto.RoomCode)
                    .Players.First(p => p.Name == playerAnswerDto.Player.Name).Score
            };
            gameRooms.First(rm => rm.RoomName == playerAnswerDto.RoomCode)
                .TriviumRounds[roundNumber]
                .Answerers.Add(pdto);

            if (gameRooms.First(rm => rm.RoomName == playerAnswerDto.RoomCode)
                .TriviumRounds[roundNumber].AnswerTrivium.Id == playerAnswerDto.AnswerId)
            {
                // player got it right, update her score
                gameRooms.First(rm => rm.RoomName == playerAnswerDto.RoomCode)
                    .Players.First(p => p.Name == playerAnswerDto.Player.Name).Score += 100;

                gameRooms.First(rm => rm.RoomName == playerAnswerDto.RoomCode)
                    .TriviumRounds[roundNumber]
                    .Answerers.First(a => a.Name == playerAnswerDto.Player.Name).Score += 100;

            }

            if (gameRooms.First(rm => rm.RoomName == playerAnswerDto.RoomCode).TriviumRounds[roundNumber].Answerers.Count == gameRooms.First(rm => rm.RoomName == playerAnswerDto.RoomCode).Players.Count)
            {
                SetRoundComplete(playerAnswerDto.RoomCode);
            }
            // List<Player> lp = gameRooms.First(rm => rm.RoomName == playerAnswerDto.RoomCode).Players.ToList();
            // foreach (var p in lp)
            // {
            //     Console.WriteLine($"{p.Name} - {p.Score}");
            // }
        }

        public bool HaveAllPlayersAnswered(string roomCode)
        {
            int roundNumber = gameRooms.First(rm => rm.RoomName == roomCode).RoundNumber;
            // if # players answered in current round == # players return true
            return gameRooms.First(rm => rm.RoomName == roomCode).TriviumRounds[roundNumber].RoundComplete;
        }

        public List<PlayerDto> GetPlayersWhoAnsweredInRound(string roomCode)
        {
            int roundNumber = gameRooms.First(rm => rm.RoomName == roomCode).RoundNumber;
            return gameRooms.First(rm => rm.RoomName == roomCode).TriviumRounds[roundNumber].Answerers;
        }

        public void SetRoundComplete(string roomCode)
        {
            int roundNumber = gameRooms.First(rm => rm.RoomName == roomCode).RoundNumber;
            gameRooms.First(rm => rm.RoomName == roomCode).TriviumRounds[roundNumber].RoundComplete = true;
        }
        public bool IsRoundComplete(string roomCode)
        {
            int roundNumber = gameRooms.First(rm => rm.RoomName == roomCode).RoundNumber;
            return gameRooms.First(rm => rm.RoomName == roomCode).TriviumRounds[roundNumber].RoundComplete;
        }

        public RoundResultsDto GetRoundResults(string roomCode)
        {
            int roundNumber = gameRooms.First(rm => rm.RoomName == roomCode).RoundNumber;

            gameRooms.First(rm => rm.RoomName == roomCode).TriviumRounds[roundNumber].Fetched = true;

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

            AdvanceToTheNextRound(roomCode);

            if (gameRooms.First(rm => rm.RoomName == roomCode).RoundNumber == gameRooms.First(rm => rm.RoomName == roomCode).TriviumRounds.Count)
            {
                triviumRoundDto.LastRound = true;
                bool over = GameIsOver(roomCode);
                Console.WriteLine("Game is over, returning final round");
            }

            return triviumRoundDto;

        }

        public bool HasRoundBeenFetched(string roomCode)
        {
            int roundNumber = gameRooms.First(rm => rm.RoomName == roomCode).RoundNumber;
            return gameRooms.First(rm => rm.RoomName == roomCode).TriviumRounds[roundNumber].Fetched;
        }

        public bool GameIsOver(string roomCode)
        {
            int roundNumber = gameRooms.First(rm => rm.RoomName == roomCode).RoundNumber;
            bool gameOver = roundNumber >= gameRooms.First(rm => rm.RoomName == roomCode).TriviumRounds.Count;
            if (gameOver)
            {
                MakeGameRoomAvailableAgain(roomCode);
            }
            return gameOver;
        }

        private void AdvanceToTheNextRound(string roomCode)
        {
            // advance to the next round
            Console.WriteLine("advancing to the next round");
            gameRooms.First(rm => rm.RoomName == roomCode).RoundNumber++;
        }

        public TriviumRoundDto FetchNextRound(string roomCode)
        {
            int roundNumber = gameRooms.First(rm => rm.RoomName == roomCode).RoundNumber;
            TriviumRound tr = gameRooms.First(rm => rm.RoomName == roomCode).TriviumRounds[roundNumber];

            // build a trivium round dto from the trivium round
            TriviumRoundDto trdto = new TriviumRoundDto();
            trdto.RoundNumber = roundNumber;
            Trivium trvium = tr.AnswerTrivium;
            var q = trvium.Question;
            var a = trvium.Answer;
            var i = trvium.Id;

            trdto.QuestionTrivium.Question = q;



            List<TriviumAnswerDto> tadl = new List<TriviumAnswerDto>();
            tadl.Add(new TriviumAnswerDto { Id = i, Answer = a });

            foreach (var t in tr.WrongTrivia)
            {
                tadl.Add(new TriviumAnswerDto { Id = t.Id, Answer = t.Answer });
            }

            // shuffle the tadl
            Random rnd = new Random();
            tadl = tadl.OrderBy(t => rnd.Next()).ToList();

            trdto.WrongTrivia = tadl;

            return trdto;
        }

        public void MakeGameRoomAvailableAgain(string roomCode)
        {
            gameRooms.Remove(gameRooms.First(gameroom => gameroom.RoomName == roomCode));
            Console.WriteLine($"room with code {roomCode} should be free....");
            foreach (Game room in gameRooms)
            {
                Console.WriteLine($"room - {room.RoomName}");
            }
        }
    }
}