using System.Threading.Tasks;
using api.Services.User;
using Microsoft.AspNetCore.SignalR;

namespace api.Messages
{
    public class MessageHub : Hub
    {
        private readonly IUserService _userService;
        public MessageHub(IUserService userService)
        {
            _userService = userService;
        }

        // public async Task SendMessage(string user, string message, string roomCode)
        // {
        //     _userService.AddUserToRoom(user, roomCode);

        //     await Clients.All.SendAsync("ReceiveMessage", user, message);
        // }

        public async Task AddToGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            await Clients.Group(groupName).SendAsync("Send", $"{Context.ConnectionId} has joined the group {groupName}.");
        }

        // public async Task RemoveFromGroup(string groupName)
        // {
        //     await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

        //     await Clients.Group(groupName).SendAsync("Send", $"{Context.ConnectionId} has left the group {groupName}");
        // }

        public async Task GetUsersInRoom(string roomCode)
        {
            await Clients.All.SendAsync("EmitUsersList", _userService.GetRoomsUsers(roomCode));
        }

        public async Task JoinRoom(string roomName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomName);
        }

        public Task LeaveRoom(string roomName)
        {
            return Groups.RemoveFromGroupAsync(Context.ConnectionId, roomName);
        }
    }
}