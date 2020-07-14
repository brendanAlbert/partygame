using System.Collections.Generic;
using System.Threading.Tasks;

namespace api.Services.Hacker
{
    public interface IHackerService
    {
        public List<api.Models.Hacker> GetHackers();
        public void AddHacker(api.Models.Hacker hacker);

    }
}