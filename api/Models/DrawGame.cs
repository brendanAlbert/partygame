using System;
using System.Collections.Generic;
using System.Linq;

namespace api.Models
{
    public class DrawGame
    {
        public string RoomName { get; set; } = "";
        public int RoundNumber { get; set; } = 0;
        public bool LastRound { get; set; } = false;
        public List<DrawPlayer> DrawPlayers { get; set; } = new List<DrawPlayer>();
        Random rnd = new Random();

        public List<DrawGameRound> GameRounds { get; set; } = new List<DrawGameRound>();

        public List<DrawPlayer> FirstRoundLobby { get; set; } = new List<DrawPlayer>();

        public List<DrawGameRound> CurrentRound { get; set; } = new List<DrawGameRound>();

        public List<string> FunnyPlaceholderImages { get; set; } = new List<string>
        {
            "dckbt_placeholder.png",
            "derpboi_placeholder.png",
            "dolan_placeholder.png",
            "doomer_placeholder.png",
            "douknodawae1_placeholder.png",
            "gooby_placeholder.png",
            "handsome_placeholder.png",
            "haterdab_placeholder.png",
            "hipsterhand_placeholder.png",
            "lenny_placeholder.png",
            "pepe1_placeholder.png",
            "pepe2_placeholder.png",
            "poohsophist_placeholder.png",
            "rarest_placeholder.png",
            "shrek_placeholder.png",
            "shrekt_placeholder.png",
            "sockpuppet_placeholder.png",
            "spongeboob_placeholder.png",
            "spooder_placeholder.png",
            "ulikekrabbypatties_placeholder.png",
        };

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
            "chad goes deep",
            "four inches of fury",
            "it looks like a cat, maybe",
            "it could possibly, maybe, be a frog",
            "i think drugs were involved",
            "baseball bat",
            "batman",
            "sandworm",
            "octopus",
            "seagull",
            "cinnamon bun",
            "stack of pancakes",
            "hansel and gretel",
            "attack moth",
            "rocket blastoff",
            "dude fishing",
            "igloo",
            "snowball fight",
            "one tall bush and two short bushes",
            "ant colony",
            "ant warfare",
            "melting icecream",
            "jerk goose",
            "looks like a tasty treat",
            "banana and two grapes",
            "two circles with dots in the middle of each",
            "whale breaching",
            "a friendly seal",
            "pikachu",
            "pokeybugs"

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
            this.GameRounds.RemoveAt(index);
            if (this.GameRounds.Count == 0)
            {
                this.LastRound = true;
                dgr.LastRound = true;
            }

            this.CurrentRound.Add(dgr);
            return dgr;
        }

        public List<DrawPlayer> AddAnswerAndReturnPlayers(DrawPlayer drawPlayer, string playerGuess)
        {
            int currentRoundIndex = this.CurrentRound.Count - 1;
            this.CurrentRound[currentRoundIndex].AllAnswers.Add(playerGuess);
            this.CurrentRound[currentRoundIndex].Players.Add(drawPlayer);
            // This player created this answer/guess.  So if anyone chooses this guess, this player gets points.
            this.CurrentRound[currentRoundIndex].ListPlayerAnswerSubmissions.Add(new Tuple<DrawPlayer, string>(drawPlayer, playerGuess));
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

            foreach (DrawPlayer dp in this.DrawPlayers)
            {
                if (drawPlayer.Name == dp.Name)
                {
                    drawPlayer.Score = dp.Score;
                    break;
                }
            }

            this.CurrentRound[currentRoundIndex].PlayersWaiting.Add(drawPlayer);

            // need to associate each answer and a list of users who guessed that answer rather than just adding each answer to the list
            this.CurrentRound[currentRoundIndex].ListPlayerAnswerTuples.Add(new Tuple<DrawPlayer, string>(drawPlayer, chosenAnswer));
        }

        public List<DrawPlayer> GetPlayersWaiting()
        {
            int currentRoundIndex = this.CurrentRound.Count - 1;

            return this.CurrentRound[currentRoundIndex].PlayersWaiting;
        }

        public DrawGameRound FetchGameRoundResults()
        {
            int currentRoundIndex = this.CurrentRound.Count - 1;

            DrawGameRound dgr = this.CurrentRound[currentRoundIndex];

            Console.WriteLine($"The answer was = {dgr.Answer}");
            foreach (Tuple<DrawPlayer, string> tple in dgr.ListPlayerAnswerTuples)
            {
                Console.WriteLine($"{tple.Item1.Name}'s img url {tple.Item1.ImageUrl}");


                foreach (DrawPlayer dp in this.DrawPlayers)
                {
                    Console.WriteLine($"{tple.Item1.Name}'s score is {dp.Score}");
                    if (tple.Item1.Name == dp.Name)
                    {
                        Console.WriteLine($"UPDATING {tple.Item1.Name}'s SCORE TO {dp.Score}");
                        tple.Item1.Score = dp.Score;
                        break;
                    }
                }

            }

            foreach (DrawPlayer dp in dgr.Players)
            {
                foreach (DrawPlayer thisdp in this.DrawPlayers)
                {
                    if (thisdp.Name == dp.Name)
                    {
                        Console.WriteLine($"UPDATING {thisdp.Name}'s SCORE TO {thisdp.Score}");
                        dp.Score = thisdp.Score;
                        break;
                    }
                }
            }

            return dgr;
        }

        public string PopRandomPlaceholderImage()
        {
            int index = rnd.Next(0, this.FunnyPlaceholderImages.Count);
            string img = this.FunnyPlaceholderImages[index];
            this.FunnyPlaceholderImages.RemoveAt(index);
            return img;
        }

        public void UpdatePlayersScores(List<DrawPlayer> drawPlayers)
        {
            foreach (DrawPlayer dp in this.DrawPlayers)
            {
                foreach (DrawPlayer incomingdp in drawPlayers)
                {
                    if (dp.Name == incomingdp.Name)
                    {
                        Console.WriteLine($"updating {dp.Name}'s score to {incomingdp.Score}");
                        dp.Score = incomingdp.Score;
                    }
                }
            }

            int currentRoundIndex = this.CurrentRound.Count - 1;

            foreach (Tuple<DrawPlayer, string> tpl in this.CurrentRound[currentRoundIndex].ListPlayerAnswerTuples)
            {
                foreach (DrawPlayer incomingdp in drawPlayers)
                {
                    if (tpl.Item1.Name == incomingdp.Name)
                    {
                        tpl.Item1.Score = incomingdp.Score;
                    }
                }
            }

            foreach (DrawPlayer dp in this.CurrentRound[currentRoundIndex].Players)
            {
                foreach (DrawPlayer incomingdp in drawPlayers)
                {
                    if (dp.Name == incomingdp.Name)
                    {
                        dp.Score = incomingdp.Score;
                    }
                }
            }



        }
    }
}