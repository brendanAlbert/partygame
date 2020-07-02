using System.Collections.Generic;

namespace api.Models
{
    public class TriviumRound
    {
        public Trivium AnswerTrivium { get; set; } // a trivium contains the question and its associated answer
        public List<Trivium> WrongTrivia { get; set; } // options are the three wrong Trivia
    }
}