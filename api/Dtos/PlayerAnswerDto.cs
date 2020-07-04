using api.Models;

namespace api.Dtos
{
    public class PlayerAnswerDto
    {
        public Player Player { get; set; }
        public string RoomCode { get; set; }
        public int AnswerId { get; set; }
        public int RoundNumber { get; set; }
    }
}