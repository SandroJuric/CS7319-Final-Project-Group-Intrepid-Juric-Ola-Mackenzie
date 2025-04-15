using InstantMessaging.Model.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace InstantMessaging.Controllers.Interfaces
{
    /// <summary>
    /// Interface for user management
    /// </summary>
    public interface IUsers
    {
        /// <summary>
        /// Create/Retrieves a user account, call this every time a user logs in
        /// </summary>
        /// <returns>User object</returns>
        ActionResult<IUser> RetrieveOrCreate();

        /// <summary>
        /// Get all current users and their status
        /// </summary>
        /// <returns>Array of sessions</returns>
        IEnumerable<IUser> Current();
    }
}
