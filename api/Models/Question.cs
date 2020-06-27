namespace api.Models
{
    public class Question
    {
        public int Id { get; set; }
        public int AnswerId { get; set; }
        public string QuestionText { get; set; }
        public Category Category { get; set; }
    }
}