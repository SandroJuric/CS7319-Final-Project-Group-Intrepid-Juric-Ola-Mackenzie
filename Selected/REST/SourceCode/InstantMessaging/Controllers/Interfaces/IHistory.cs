using Microsoft.AspNetCore.Mvc;

namespace InstantMessaging.Controllers.Interfaces
{
    /// <summary>
    /// Interface for the history controller
    /// </summary>
    public interface IHistory
    {
        /// <summary>
        /// Get all historical sessions
        /// </summary>
        /// <returns>Array of sessions</returns>
        IEnumerable<Model.Interfaces.ISession> HistoricalSessions();

        /// <summary>
        /// Delete the session from active sessions, and moves it to archive
        /// </summary>
        /// <returns>Number of records affected</returns>
        ActionResult<int> RemoveSession(int id);
    }
}
