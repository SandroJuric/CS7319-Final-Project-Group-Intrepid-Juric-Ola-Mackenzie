using JetBrains.Annotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace InstantMessagingPublisher.Controllers
{
    /// <summary>
    /// SignalR hub for BRC
    /// </summary>
    [UsedImplicitly]
    [AllowAnonymous]
    public class AccountsHub : Hub
    {
        /// <summary>
        /// Init the connection with SignalR
        /// </summary>
        /// <returns></returns>
        public Task CheckConnection()
        {
            return Clients.All.SendAsync("CheckConnection", "Started successfully");
        }

        /// <summary>
        /// Send message to all clients when account is changed
        /// </summary>
        /// <param name="user"></param>
        /// <param name="message"></param>
        /// <returns></returns>
        public async Task AccountChanged(string user, string message)
        {
            await Clients.All.SendAsync("AccountChanged", user, message);
        }
    }
}
