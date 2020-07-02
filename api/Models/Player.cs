namespace api.Models
{
    public class Player
    {
        public string ConnectionId { get; set; }
        public bool IsAdmin { get; set; } = false;
        public int Score { get; set; } = 0;
        public string Name { get; set; }
    }
}