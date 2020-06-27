using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using api.Models;
using api.Services.Trivia;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController, Route("[controller]")]
    public class TriviaController : ControllerBase
    {
        private readonly ITriviaService _triviaService;

        public TriviaController(ITriviaService triviaService)
        {
            _triviaService = triviaService;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await _triviaService.GetTriviaObjects());
        }
    }
}