namespace api.Models
{
    public class Trivium
    {
        public int Id { get; set; }
        public string Question { get; set; }
        public string Answer { get; set; }
        public Category Category { get; set; }
    }
}