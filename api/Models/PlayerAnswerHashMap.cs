using System;
using System.Collections.Generic;

namespace api.Models
{
    public class PlayerAnswerHashMap
    {
        // this is how chose which answer
        public Dictionary<string, List<DrawPlayer>> Associations { get; set; } = new Dictionary<string, List<DrawPlayer>>();
        // public Dictionary<DrawPlayer, string> PlayerWhoSubmittedAnswer { get; set; } = new Dictionary<DrawPlayer, string>();

    }
}