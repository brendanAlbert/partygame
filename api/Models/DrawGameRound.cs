using System;
using System.Collections.Generic;

namespace api.Models
{
    public class DrawGameRound
    {
        public List<DrawPlayer> Players { get; set; } = new List<DrawPlayer>();
        public List<DrawPlayer> PlayersWaiting { get; set; } = new List<DrawPlayer>();

        // this is a list of players and the answers they chose
        public List<Tuple<DrawPlayer, string>> ListPlayerAnswerTuples { get; set; } = new List<Tuple<DrawPlayer, string>>();

        public List<Tuple<DrawPlayer, string>> ListPlayerAnswerSubmissions { get; set; } = new List<Tuple<DrawPlayer, string>>();


        public string ImageUrl { get; set; } = "";

        public List<string> AllAnswers { get; set; } = new List<string>();

        public string Answer { get; set; } = "";
        public bool LastRound { get; set; } = false;
    }
}