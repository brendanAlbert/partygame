using System.Collections.Generic;

namespace api.Dtos
{
    public class RoundResultsDto
    {
        public bool LastRound { get; set; } = false;
        public string Question { get; set; }
        public string Answer { get; set; }
        public List<string> OtherAnswers { get; set; } = new List<string>();
        public List<PlayerDto> Players { get; set; } = new List<PlayerDto>();
    }

    public class PlayerDto
    {
        public string Name { get; set; }
        public int AnswerId { get; set; }
        public string Answer { get; set; }
        public int Score { get; set; }
    }
}