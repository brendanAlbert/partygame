using System;
using System.Collections.Generic;
using System.Linq;

namespace api.Models
{
    public class DrawGame
    {
        public string RoomName { get; set; } = "";
        public int RoundNumber { get; set; } = 0;
        public List<DrawPlayer> DrawPlayers { get; set; } = new List<DrawPlayer>();
        Random rnd = new Random();

        public List<DrawGameRound> GameRounds { get; set; } = new List<DrawGameRound>();

        public List<DrawPlayer> FirstRoundLobby { get; set; } = new List<DrawPlayer>();

        public List<DrawGameRound> CurrentRound { get; set; } = new List<DrawGameRound>();



        public List<string> AvailableColor1List { get; set; } = new List<string>
        {
            "#1abc9c", // turquoise
            "#2ecc71", // emerald green
            "#3498db", // peter river blue
            "#9b59b6", // amethyst purple
            "#34495e", // wet asphalt grey
            "#f1c40f", // sunflower yellow
            "#e67e22", // carrot orange
            "#e74c3c", // alizarin light red

            "#ff9ff3", // jigglypuff
            "#feca57", // cassandra yellow
            "#ff6b6b", // pastel red
            "#48dbfb", // megaman blue
            "#54a0ff", // joust blue

        };
        public List<string> AvailableColor2List { get; set; } = new List<string>
        {
            "#16a085", // sea green
            "#27ae60", // nephritis green
            "#2980b9", // belize hole blue
            "#8e44ad", // wisteria purple
            "#2c3e50", // midnight blue
            "#f39c12", // orange
            "#d35400", // pumpkin orange
            "#c0392b", // pomegranate red

            "#f368e0", // lian hong lotus pink
            "#ff9f43", // double dragon skin tangerine
            "#ee5253", // amour red
            "#0abde3", // cyanite
            "#2e86de", // bleu de france

        };

        public List<string> Prompts { get; set; } = new List<string>
        {
            "yoda wearing an 80's workout onesie",
            "a duck",
            "coffee boom booms",
            "the mandalorian",
            "thicc banana",
            "single ply toilet paper makes my booty bleed",
            "cat and mouse having a stare down",
            "maam, this is a Wendy's drive through",
            "snowboarding yeti",
            "a spooky ghost",
            "raining hotdogs",
            "ummm, tacos I guess",
            "even a broken clock is right twice a day",
            "the city of angels",
            "surrounded by smooth brains",
            "starving zombie",
            "hummingbird wearing a tophat",
            "baby yoda force chokin a foo",
            "astros getting walked cause they cheatin",
            "seattle kraken",
            "fireworks display",
            "waffle cake",
            "stupid-sexy benjamin franklin",
            "dwight schrute",
            "surfing hamster",
            "swamp ass",
            "an unnecessary amount of ham",
            "butterfly karaoke",
            "department of redundancy department",
            "bakin soda, I got bakin soda",
            "i'm in love with the coco",
            "weiner dog riding a unicycle",
            "hackerman",
            "lizard wearing a face mask",
            "pied piper leading rats",
            "snow white and the 7 dwarves",
            "the three little pigs",
            "shrek at a truckstop gloryhole",
            "the little mermaid",
            "spongebob frolicking merrily",
            "the state of kansas",
            "amber waves of grain",
            "purple mountains majesties",
            "everything's bigger in Texas",
            "chewbacca dropping a deuce",
            "salt and pepper bickering over who is the better condiment",
            "delicious chocolate, chocolate-chip muffin",
            "'Merica",
            "adorable puddle of puppies",
            "hotdog stand",
            "grilling some weiners",
            "crisp, ice-cold beer",
            "hanging some dong",
            "a snail with a checkered past",
            "mischievous squirrel",
            "flatulent capybara",
            "cow being abducted by aliens",
            "great wall of china",
            "aztec symbology",
            "mayan warlord",
            "sexy pufferfish",
            "handsome squidward tentacles",
            "egyptian hieroglyphs",
            "chinese funerary texts",
            "japanese kanji",
            "aggressive jehovah's witnesses",
            "kid getting rekt at dodgeball",
            "snake in a boot",
            "bear wearing a hat",
            "koi pond",
            "farming peanuts",
            "a tasty dorito",
            "vision quest after eating a funny looking mushroom",
            "the machismo of shrek",
            "a hairy caterpillar",
            "a hairy flying hotdog",
            "cute kangaroo joey",
            "a hogwarts wizard casting a spell to shave his pubes",
            "playing the bassoon most excellently",
            "sicky gnar gnar wave brochacho",
            "snape's awkward cousin phil",
            "ragnar - slayer of booty",
            "ky jelly, alcohol, and a night of experimentation",
            "jean-luc picard of the uss enterprise",
            "chad goes deep"
        };

        public Tuple<string, string> GetColorPair()
        {
            // generate a random number from 0 to length of available colors list - 1
            int index = rnd.Next(0, this.AvailableColor1List.Count);
            Tuple<string, string> colorDict = new Tuple<string, string>(this.AvailableColor1List[index], this.AvailableColor2List[index]);
            this.AvailableColor1List.RemoveAt(index);
            this.AvailableColor2List.RemoveAt(index);
            return colorDict;
        }

        public string PopRandomPrompt()
        {
            int index = rnd.Next(0, this.Prompts.Count);
            string p = this.Prompts[index];
            this.Prompts.RemoveAt(index);
            return p;
        }

        public void AddArtSubmission(string url, string correctAnswerPrompt)
        {
            DrawGameRound dgr = new DrawGameRound();
            dgr.AllAnswers.Add(correctAnswerPrompt);
            dgr.Answer = correctAnswerPrompt;
            dgr.ImageUrl = url;
            this.GameRounds.Add(dgr);
        }

        public DrawGameRound FetchRandomGameRound()
        {
            int index = rnd.Next(0, this.GameRounds.Count);
            DrawGameRound dgr = this.GameRounds[index];
            this.CurrentRound.Add(dgr);
            this.GameRounds.RemoveAt(index);
            return dgr;
        }

        public List<DrawPlayer> AddAnswerAndReturnPlayers(DrawPlayer drawPlayer, string playerGuess)
        {
            int currentRoundIndex = this.CurrentRound.Count - 1;
            this.CurrentRound[currentRoundIndex].AllAnswers.Add(playerGuess);
            this.CurrentRound[currentRoundIndex].Players.Add(drawPlayer);
            return this.CurrentRound[currentRoundIndex].Players;
        }

        public List<string> GetAllAnswersCurrentRound()
        {
            int currentRoundIndex = this.CurrentRound.Count - 1;

            return this.GetShuffledAnswers(this.CurrentRound[currentRoundIndex].AllAnswers);
        }

        public List<string> GetShuffledAnswers(List<string> answers)
        {
            return answers.OrderBy(a => rnd.Next()).Take(answers.Count).ToList();
        }
        public void AddPlayerToWaiting(DrawPlayer drawPlayer, string chosenAnswer)
        {
            int currentRoundIndex = this.CurrentRound.Count - 1;

            this.CurrentRound[currentRoundIndex].PlayersWaiting.Add(drawPlayer);

            this.CurrentRound[currentRoundIndex].ListPlayerAnswerTuples.Add(new Tuple<DrawPlayer, string>(drawPlayer, chosenAnswer));
        }

        public List<DrawPlayer> GetPlayersWaiting()
        {
            int currentRoundIndex = this.CurrentRound.Count - 1;

            return this.CurrentRound[currentRoundIndex].PlayersWaiting;
        }


    }
}