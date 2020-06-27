using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos;
using api.Models;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace api.Services.Trivia
{
    public class TriviaService : ITriviaService
    {
        private readonly IMapper _mapper;
        private readonly DataContext _context;
        private Random rnd = new Random();
        public TriviaService(IMapper mapper, DataContext context)
        {
            _context = context;
            _mapper = mapper;
            // , IHttpContextAccessor httpContextAccessor
            // _httpContextAccessor = httpContextAccessor;
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

        public async Task<ServiceResponse<List<GetTriviaDto>>> GetTriviaObjects()
        {
            ServiceResponse<List<GetTriviaDto>> serviceResponse = new ServiceResponse<List<GetTriviaDto>>();

            List<GetTriviaDto> trivia = await getListOfNTrivia(10);

            // serviceResponse.Data = (trivia.Select(c => _mapper.Map<Trivium>(c))).ToList();
            serviceResponse.Data = trivia;

            return serviceResponse;
        }

        private async Task<List<GetTriviaDto>> getListOfNTrivia(int numberOfTrivium)
        {
            // List<Question> dbQuestions = await _context.Questions.ToListAsync();
            // List<Answer> dbAnswers = await _context.Answers.ToListAsync();
            List<Trivium> dbTrivia = await _context.Trivia.ToListAsync();

            List<GetTriviaDto> Trivia = new List<GetTriviaDto>();

            for (int i = 0; i < numberOfTrivium; i++)
            {
                int randomQuestionIndex = rnd.Next(dbTrivia.Count) + 1; // needed the +1 because there is no question with id = 0

                Trivium t = dbTrivia.First(q => q.Id == randomQuestionIndex);
                string q = t.Question;
                string a = t.Answer;
                Category c = t.Category;
                // List<Answer> optionsWithAnswer = addAnswerIfNotPresent(dbAnswers, a);


                var opts = dbTrivia.Where(opt => opt.Category == c).Select(opt => opt.Answer).OrderBy(a => rnd.Next()).Take(4).ToList();
                var ans = opts.FirstOrDefault(answer => answer.Equals(a));

                if (ans == null)
                {
                    int randomIndexToReplace = rnd.Next(4);
                    opts[randomIndexToReplace] = a;
                }

                GetTriviaDto GetTriviaDto = new GetTriviaDto
                {
                    Question = q,
                    // Options = dbTrivia.Select(opt => opt.Answer).Take(4).ToList()
                    Options = opts
                };

                Trivia.Add(GetTriviaDto);
            }

            return Trivia;
        }
    }
}