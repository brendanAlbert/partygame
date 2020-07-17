using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos;
using api.Models;
using AutoMapper;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace api.Services.Trivia
{
    public class TriviaService : ITriviaService
    {
        // private readonly DataContext _context;
        private readonly IGameRoomService _gameRoomService;
        private readonly IMapper _mapper;
        private Random rnd = new Random();
        public TriviaService(IGameRoomService gameRoomService, IMapper mapper)
        {
            // _context = context;DataContext context,
            _gameRoomService = gameRoomService;
            _mapper = mapper;
        }

        private Answer getAnswerForQuestion(List<Answer> dbAnswers, int questionId)
        {
            return dbAnswers.First(a => a.Id == questionId);
        }

        private List<Answer> addAnswerIfNotPresent(List<Answer> dbAnswers, Answer a)
        {
            var options1 = dbAnswers.OrderBy(a => rnd.Next()).Take(4).ToList();
            var ans = options1.FirstOrDefault(answer => answer.Id == a.Id);

            if (ans == null)
            {
                int randomIndexToReplace = rnd.Next(4);
                Console.WriteLine($"Replacing index {randomIndexToReplace}");
                options1[randomIndexToReplace] = a;
            }

            // else the answer already exists in the options, what luck!
            return options1;
        }

        // public async Task<ServiceResponse<List<GetTriviaDto>>> GetTriviaObjects()
        // {
        //     ServiceResponse<List<GetTriviaDto>> serviceResponse = new ServiceResponse<List<GetTriviaDto>>();

        //     List<GetTriviaDto> trivia = await getListOfNTrivia(4);

        //     // serviceResponse.Data = (trivia.Select(c => _mapper.Map<Trivium>(c))).ToList();
        //     serviceResponse.Data = trivia;

        //     return serviceResponse;
        // }

        // private async Task<List<GetTriviaDto>> getListOfNTrivia(int numberOfTrivium)
        // {
        //     // List<Question> dbQuestions = await _context.Questions.ToListAsync();
        //     // List<Answer> dbAnswers = await _context.Answers.ToListAsync();
        //     // List<Trivium> dbTrivia = await _context.Trivia.ToListAsync();

        //     List<GetTriviaDto> Trivia = new List<GetTriviaDto>();

        //     for (int i = 0; i < numberOfTrivium; i++)
        //     {
        //         int randomQuestionIndex = rnd.Next(dbTrivia.Count) + 1; // needed the +1 because there is no question with id = 0

        //         Trivium t = dbTrivia.First(q => q.Id == randomQuestionIndex);
        //         string q = t.Question;
        //         string a = t.Answer;
        //         Category c = t.Category;
        //         // List<Answer> optionsWithAnswer = addAnswerIfNotPresent(dbAnswers, a);


        //         var opts = dbTrivia.Where(opt => opt.Category == c).Select(opt => opt.Answer).OrderBy(a => rnd.Next()).Take(4).ToList();
        //         var ans = opts.FirstOrDefault(answer => answer.Equals(a));

        //         if (ans == null)
        //         {
        //             int randomIndexToReplace = rnd.Next(4);
        //             opts[randomIndexToReplace] = a;
        //         }

        //         GetTriviaDto GetTriviaDto = new GetTriviaDto
        //         {
        //             Question = q,
        //             // Options = dbTrivia.Select(opt => opt.Answer).Take(4).ToList()
        //             Options = opts
        //         };

        //         Trivia.Add(GetTriviaDto);
        //     }

        //     return Trivia;
        // }

        // public async Task<List<TriviumRound>> GetTriviumRounds(int numberOfTrivia, string roomname)
        // {

        //     List<TriviumRound> TriviumRounds = _gameRoomService.GetGameRoom(roomname).TriviumRounds;

        //     if (TriviumRounds == null)
        //     {
        //         // from database
        //         List<Trivium> dbTrivia = await _context.Trivia.ToListAsync();

        //         TriviumRounds = new List<TriviumRound>();

        //         for (int i = 0; i < numberOfTrivia; i++)
        //         {
        //             TriviumRound tr = new TriviumRound();

        //             int randomQuestionIndex = rnd.Next(dbTrivia.Count) + 1; // needed the +1 because there is no question with id = 0

        //             // here is the AnswerTrivium
        //             Trivium t = dbTrivia.First(q => q.Id == randomQuestionIndex);
        //             string q = t.Question;
        //             string a = t.Answer;
        //             Category c = t.Category;

        //             tr.AnswerTrivium = t;

        //             // List<Answer> optionsWithAnswer = addAnswerIfNotPresent(dbAnswers, a);

        //             // Now get three Wrong Trivia

        //             List<Trivium> options = dbTrivia.Where(opt => opt.Category == c).OrderBy(a => rnd.Next()).Take(3).ToList();
        //             tr.WrongTrivia = options;

        //             // var opts = dbTrivia.Where(opt => opt.Category == c).Select(opt => opt.Answer).OrderBy(a => rnd.Next()).Take(4).ToList();
        //             // var ans = opts.FirstOrDefault(answer => answer.Equals(a));

        //             // if (ans == null)
        //             // {
        //             //     int randomIndexToReplace = rnd.Next(4);
        //             //     opts[randomIndexToReplace] = a;
        //             // }

        //             // GetTriviaDto GetTriviaDto = new GetTriviaDto
        //             // {
        //             //     Question = q,
        //             //     // Options = dbTrivia.Select(opt => opt.Answer).Take(4).ToList()
        //             //     Options = opts
        //             // };

        //             // Trivia.Add(GetTriviaDto);

        //             TriviumRounds.Add(tr);
        //         }

        //         _gameRoomService.SetRoundsForGameRoom(TriviumRounds, roomname);
        //     }




        //     return _gameRoomService.GetGameRoom(roomname).TriviumRounds;
        // }

        public TriviumRoundDto GetTriviumRoundDtoFromRoom(int roundNumber, string roomname)
        {
            TriviumRound triviumRound = _gameRoomService.GetGameRoom(roomname).TriviumRounds[roundNumber];

            // answer trivium
            Trivium at = triviumRound.AnswerTrivium;
            List<Trivium> wt = triviumRound.WrongTrivia;
            // get the question dto
            TriviumQuestionDto tqd = _mapper.Map<TriviumQuestionDto>(at);
            // TriviumAnswerDto tad = _mapper.Map<TriviumAnswerDto>(wt);

            List<TriviumAnswerDto> tadl = wt.Select(t => _mapper.Map<TriviumAnswerDto>(t)).ToList();


            tadl.Add(_mapper.Map<TriviumAnswerDto>(at));

            // shuffle the tadl
            tadl = tadl.OrderBy(t => rnd.Next()).ToList();

            // add Dtos to TriviumRoundDto
            TriviumRoundDto tdto = new TriviumRoundDto();
            tdto.QuestionTrivium = tqd;
            tdto.WrongTrivia = tadl;
            return tdto;
        }

        public List<Trivium> GetTriviaFromDatabase()
        {
            List<Trivium> trivia = new List<Trivium>();

            using (var connection = new SqliteConnection("Data Source=trivia.db"))
            {
                connection.Open();

                var command = connection.CreateCommand();

                command.CommandText = @"CREATE TABLE IF NOT EXISTS Trivia 
                (id INTEGER NOT NULL PRIMARY KEY,
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                category INT NOT NULL )";
                command.ExecuteNonQuery();

                command.CommandText = @"SELECT id, question, answer, category FROM Trivia";

                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var id = reader.GetInt32(0);
                        var question = reader.GetString(1);
                        var answer = reader.GetString(2);
                        Category category = (api.Models.Category)reader.GetInt32(3);

                        trivia.Add(new Trivium { Id = id, Question = question, Answer = answer, Category = category });
                    }

                }

                // seed trivia database if no data exists yet
                if (trivia.Count == 0)
                {
                    command.CommandText = @"INSERT INTO Trivia ( id, question, answer, category ) 
                    VALUES 
                    (null, 'the year ghostbusters came out', '1984', 10),
                    (null, 'what year did audiences learn that in space no one can hear you scream', '1979', 10),
                    (null, 'when did star wars release', '1977', 10),
                    (null, 'what year is in the title of the movie with the a.i. H.A.L', '2001', 10),
                    (null, 'what year did johnny depps sleepy hollow release', '1999', 10),
                    (null, 'what year is blade runner with harrison ford supposed to take place', '2019', 10),
                    (null, 'in what year does blade runner with ryan gosling take place', '2049', 10)";

                    command.ExecuteNonQuery();

                    command.CommandText = @"SELECT id, question, answer, category FROM Trivia";

                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var id = reader.GetInt32(0);
                            var question = reader.GetString(1);
                            var answer = reader.GetString(2);
                            Category category = (api.Models.Category)reader.GetInt32(3);

                            trivia.Add(new Trivium { Id = id, Question = question, Answer = answer, Category = category });
                        }
                    }
                }

            }


            return trivia;
        }

        public void InitializeTriviumGameRoom(int numberOfTrivia, string roomname)
        {
            List<TriviumRound> TriviumRounds = new List<TriviumRound>();
            // from database

            // This is how we access the db using Entity Framework Core
            // List<Trivium> dbTrivia = _context.Trivia.ToList();

            // Now, let's build and access the db the same way we did the hackers/users
            List<Trivium> dbTrivia = GetTriviaFromDatabase().ToList();


            HashSet<int> seenIndices;

            // we need to get 

            for (int i = 0; i < numberOfTrivia; i++)
            {
                TriviumRound tr = new TriviumRound();

                int randomQuestionIndex = rnd.Next(dbTrivia.Count) + 1; // needed the +1 because there is no question with id = 0
                seenIndices = new HashSet<int>();
                seenIndices.Add(randomQuestionIndex);

                // here is the AnswerTrivium
                Trivium t = dbTrivia.First(q => q.Id == randomQuestionIndex);
                string q = t.Question;
                string a = t.Answer;
                Category c = t.Category;

                tr.AnswerTrivium = t;

                List<Trivium> options = dbTrivia.Where(opt => opt.Category == c && !seenIndices.Contains(opt.Id)).OrderBy(a => rnd.Next()).Take(3).ToList();
                tr.WrongTrivia = options;



                TriviumRounds.Add(tr);
            }

            _gameRoomService.SetRoundsForGameRoom(TriviumRounds, roomname);

        }
    }
}