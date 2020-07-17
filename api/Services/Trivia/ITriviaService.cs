using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using api.Dtos;
using api.Models;

namespace api.Services.Trivia
{
    public interface ITriviaService
    {
        // Task<ServiceResponse<List<GetTriviaDto>>> GetTriviaObjects();
        // Task<List<TriviumRound>> GetTriviumRounds(int numberOfTrivia, string roomname);
        TriviumRoundDto GetTriviumRoundDtoFromRoom(int roundNumber, string roomname);
        public List<Trivium> GetTriviaFromDatabase();
        void InitializeTriviumGameRoom(int numberOfTrivia, string roomname);
    }
}