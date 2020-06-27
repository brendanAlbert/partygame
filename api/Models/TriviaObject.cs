using System.Collections.Generic;

namespace api.Models
{
    public class TriviaObject
    {
        public int Id { get; set; }
        public Question Question { get; set; }
        public Answer Answer { get; set; }
        public List<Answer> Options { get; set; }
    }
}