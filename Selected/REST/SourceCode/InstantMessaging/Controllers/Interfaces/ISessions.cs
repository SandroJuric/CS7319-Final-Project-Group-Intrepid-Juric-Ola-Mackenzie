using Microsoft.AspNetCore.Mvc;

namespace InstantMessaging.Controllers.Interfaces
{
    /// <summary>
    /// Interface for Session management
    /// </summary>
    public interface ISessions
    {
        /// <summary>
        /// Create a new session
        /// </summary>
        /// <param name="userId">Pass the user id with whom you wish to create session with</param>
        /// <returns>Newly created Session object</returns>
        ActionResult<Model.Interfaces.ISession> Create(int userId);

        /// <summary>
        /// Delete a session
        /// </summary>
        /// <param name="id">Session ID</param>
        /// <returns>Number of records affected</returns>
        ActionResult<int> Terminate(int id);

        /// <summary>
        /// Get all current session the user belong to
        /// </summary>
        /// <returns>Array of Session objects</returns>
        IEnumerable<Model.Interfaces.ISession> Current();

        /// <summary>
        /// Get all new session from the last session id
        /// </summary>
        /// <param name="lastId">Starting from what session id</param>
        /// <returns>Array of Session objects</returns>
        IEnumerable<Model.Interfaces.ISession> Recent(int lastId);
    }
}
