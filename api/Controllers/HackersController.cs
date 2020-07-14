
using System;
using System.Threading.Tasks;
using api.Models;
using api.Services.Hacker;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController, Route("[controller]")]
    public class HackersController : ControllerBase
    {
        private readonly IHackerService _hackerService;
        public HackersController(IHackerService hackerService)
        {
            _hackerService = hackerService;
        }

        [HttpGet]
        public IActionResult GetHackers()
        {
            Console.WriteLine("fetching hackers");
            return Ok(_hackerService.GetHackers());
        }

        [HttpPost, Route("add")]
        public IActionResult AddHacker(Hacker hacker)
        {
            Console.WriteLine("add hacker");
            Console.WriteLine(hacker.Name);
            Console.WriteLine(hacker.Score);
            _hackerService.AddHacker(hacker);
            return Accepted();
        }
    }
}