using System.Collections.Generic;

namespace api.Models
{
    public class Game
    {
        public string RoomName { get; set; }
        public int RoundNumber { get; set; } = 0;
        public List<Player> Players { get; set; } = new List<Player>();
        // public Dictionary<Player, int> Scores { get; set; }
        // public List<string> ConnectionIds { get; set; }
        public List<TriviumRound> TriviumRounds { get; set; }
    }
}