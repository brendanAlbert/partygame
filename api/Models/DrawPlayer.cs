namespace api.Models
{
    public class DrawPlayer
    {
        public string Id { get; set; }
        public string ConnectionString { get; set; }
        public bool IsAdmin { get; set; }
        public int Score { get; set; }
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public string Color1 { get; set; }
        public string Color2 { get; set; }
        public string GaryTrail { get; set; } = "";
        public bool StillDrawing { get; set; } = true;
    }
}