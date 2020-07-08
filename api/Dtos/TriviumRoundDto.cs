using System.Collections.Generic;

namespace api.Dtos
{
    public class TriviumRoundDto
    {
        public int RoundNumber { get; set; } = 0;
        public TriviumQuestionDto QuestionTrivium { get; set; } = new TriviumQuestionDto();
        public List<TriviumAnswerDto> WrongTrivia { get; set; } = new List<TriviumAnswerDto>();

    }
}