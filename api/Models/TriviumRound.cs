using System.Collections.Generic;
using api.Dtos;

namespace api.Models
{
    public class TriviumRound
    {
        public Trivium AnswerTrivium { get; set; } // a trivium contains the question and its associated answer
        public List<Trivium> WrongTrivia { get; set; } // options are the three wrong Trivia
        public List<PlayerDto> Answerers { get; set; } = new List<PlayerDto>();
        public bool RoundComplete { get; set; } = false;
        public bool Fetched { get; set; } = false;
    }
}