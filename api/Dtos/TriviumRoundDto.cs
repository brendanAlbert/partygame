using System.Collections.Generic;

namespace api.Dtos
{
    public class TriviumRoundDto
    {
        public TriviumQuestionDto QuestionTrivium { get; set; }
        public List<TriviumAnswerDto> WrongTrivia { get; set; }

    }
}