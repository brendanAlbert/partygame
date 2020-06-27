namespace api.Models
{
    public class Answer
    {
        public int Id { get; set; }
        public string AnswerText { get; set; }
        public Category Category { get; set; }
    }
}