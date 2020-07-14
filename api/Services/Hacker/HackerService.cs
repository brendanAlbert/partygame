using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.Sqlite;

namespace api.Services.Hacker
{
    public class HackerService : IHackerService
    {
        public HackerService()
        {
        }

        public void AddHacker(api.Models.Hacker hacker)
        {
            using (var connection = new SqliteConnection("Data Source=hackers.db"))
            {
                connection.Open();

                var command = connection.CreateCommand();
                command.CommandText = $"INSERT INTO tophackers(name,score) VALUES(@name, @score)";
                command.Parameters.AddWithValue("@name", hacker.Name);
                command.Parameters.AddWithValue("@score", hacker.Score);
                command.Prepare();
                command.ExecuteNonQuery();

                Console.WriteLine("should have added h@ck3r");
            }
        }

        public List<api.Models.Hacker> GetHackers()
        {
            List<api.Models.Hacker> hackers = new List<api.Models.Hacker>();

            using (var connection = new SqliteConnection("Data Source=hackers.db"))
            {
                connection.Open();

                var command = connection.CreateCommand();
                command.CommandText = @"SELECT name, score FROM tophackers ORDER BY score DESC LIMIT 8";

                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var name = reader.GetString(0);
                        var score = reader.GetInt32(1);

                        hackers.Add(new api.Models.Hacker { Name = name, Score = score });
                    }
                }
            }

            Console.WriteLine("returning h@ck3r5");
            return hackers;
        }
    }
}