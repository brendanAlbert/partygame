using System.Collections.Generic;
using api.Models;

namespace api.Dtos
{
    public class GetTriviaDto
    {
        // public int Id { get; set; }
        public string Question { get; set; }
        public List<string> Options { get; set; }
    }
}