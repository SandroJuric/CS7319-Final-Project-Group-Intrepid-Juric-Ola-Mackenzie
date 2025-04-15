using InstantMessaging.Model;
using InstantMessaging.Model.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace InstantMessaging.Controllers.Interfaces
{
    /// <summary>
    /// Interface for user account management
    /// </summary>
    public interface IAccount
    {
        /// <summary>
        /// Removes the users from available users
        /// </summary>
        /// <returns>Number of records affected</returns>
        ActionResult<int> LogOut();

        /// <summary>
        /// Changes the users online status
        /// </summary>
        /// <returns>Number of records affected</returns>
        ActionResult<int> ToggleStatus();

        /// <summary>
        /// Get all account details
        /// </summary>
        /// <returns>User object</returns>
        ActionResult<IUser> Details();

        /// <summary>
        /// Update user's account details, supports updating Display Name, Picture, Email
        /// </summary>
        /// <param name="user">User object with all the data</param>
        /// <returns>Number of rows affected</returns>
        ActionResult<int> Update(User user);

        /// <summary>
        /// Delete user's account
        /// </summary>
        /// <returns>Number of records affected</returns>
        ActionResult<int> Remove();
    }
}
