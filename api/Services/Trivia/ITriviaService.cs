using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using api.Dtos;
using api.Models;

namespace api.Services.Trivia
{
    public interface ITriviaService
    {
        // Task<List<TriviaObject>> GetTriviaObjects();
        Task<ServiceResponse<List<GetTriviaDto>>> GetTriviaObjects();
        // // Task<ServiceResponse<List<GetTriviaDto>>> GetTriviaObjects();
        // Task<ServiceResponse<GetTriviaDto>> GetTriviaObjectById(int id);
    }
}