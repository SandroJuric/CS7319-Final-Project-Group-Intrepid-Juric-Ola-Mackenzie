using InstantMessaging.Model;
using InstantMessaging.Model.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace InstantMessaging.Controllers.Interfaces
{
    /// <summary>
    /// Interface for message management
    /// </summary>
    public interface IMessages
    {
        /// <summary>
        /// Create a new message for given session
        /// </summary>
        /// <returns>Newly created Message object</returns>
        ActionResult<IMessage> Create(MessagePost message);

        /// <summary>
        /// Get all new messages since last time for given session
        /// </summary>
        /// <param name="lastId">From what ID</param>
        /// <param name="sessionId">Session ID</param>
        /// <returns>Array of messages</returns>
        IEnumerable<IMessage> Recent(int lastId, int sessionId);
    }
}