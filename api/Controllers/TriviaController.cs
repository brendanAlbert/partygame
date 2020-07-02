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
        private readonly IGameRoomService _gameRoomService;

        public TriviaController(ITriviaService triviaService, IGameRoomService gameRoomService)
        {
            _gameRoomService = gameRoomService;
            _triviaService = triviaService;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await _triviaService.GetTriviaObjects());
        }

        [HttpGet, Route("{roomname}")]
        public async Task<IActionResult> GetTriviumRounds(string roomname)
        {
            // return Ok(await _gameRoomService.)

            return Ok(await _triviaService.GetTriviumRounds(4, roomname));
        }

        [HttpGet, Route("{roomname}/{roundNumber}")]
        public IActionResult GetTriviumRoundNumber(string roomname, int roundNumber)
        {
            // return Ok(await _gameRoomService.)


            // return Ok(await _triviaService.GetTriviumRounds(4, roomname));

            return Ok(_triviaService.GetTriviumRoundDtoFromRoom(roundNumber, roomname));
        }
    }
}