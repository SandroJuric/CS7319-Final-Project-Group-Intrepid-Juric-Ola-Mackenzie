using InstantMessaging.Controllers.Interfaces;
using InstantMessaging.Model;
using InstantMessaging.Model.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InstantMessaging.Controllers
{
    /// <inheritdoc cref="IAccount"/>
    [ApiController]
    [Route("/Account")]
    [Authorize]
    public class Account : Controller, IAccount
    {
        private readonly ICurrentUser _currentUser;
        private readonly AppContext _context;

        /// <summary>
        /// Constructor for the Account controller
        /// </summary>
        /// <param name="currentUser">Current User Context</param>
        /// <param name="context">DB Context</param>
        public Account(ICurrentUser currentUser, AppContext context)
        {
            this._currentUser = currentUser;
            this._context = context;
        }

        /// <summary>
        /// Removes the account from available users
        /// </summary>
        /// <returns>Number of records affected</returns>
        [ProducesResponseType(StatusCodes.Status202Accepted)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpPatch("LogOut")]
        public ActionResult<int> LogOut()
        {
            var user = _context.Users.FirstOrDefault(a => a.Username == _currentUser.UserName);

            if (user == null)
                return NotFound();

            user.Status = false;
            var affectedRows = _context.SaveChanges();

            return Accepted(affectedRows);
        }

        /// <summary>
        /// Changes the user's online status
        /// </summary>
        /// <returns>Number of records affected</returns>
        [ProducesResponseType(StatusCodes.Status202Accepted)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpPatch("Status")]
        public ActionResult<int> ToggleStatus()
        {
            var user = _context.Users.FirstOrDefault(a => a.Username == _currentUser.UserName);

            if (user == null)
                return NotFound();

            user.Status = user.Status ^ true;
            _context.SaveChanges();
            var affectedRows = _context.SaveChanges();

            return Accepted(affectedRows);
        }

        /// <summary>
        /// Get all account details
        /// </summary>
        /// <returns>User object</returns>
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpGet("")]
        public ActionResult<IUser> Details()
        {
            var user = _context.Users.FirstOrDefault(a => a.Username == _currentUser.UserName);

            if (user == null)
                return NotFound();

            var cUser = new User()
            {
                UserId = user.UserId,
                UserName = user.Username,
                Email = user.Email,
                Active = user.Active,
                Status = user.Status,
                Picture = user.Picture,
                DisplayName = user.DisplayName
            };

            return cUser;
        }

        /// <summary>
        /// Update user's account details, supports updating Display Name, Picture, Email
        /// </summary>
        /// <param name="user">User object with all the data</param>
        /// <returns>Number of rows affected</returns>
        [ProducesResponseType(StatusCodes.Status202Accepted)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpPut("")]
        public ActionResult<int> Update(User user)
        {
            var cUser = _context.Users.FirstOrDefault(a => a.Username == _currentUser.UserName);

            if (cUser == null)
                return NotFound();

            cUser.Picture = user.Picture;
            cUser.DisplayName = user.DisplayName;
            cUser.Email = user.Email;

            _context.SaveChanges();

            return Accepted(1);
        }

        /// <summary>
        /// Delete user's account
        /// </summary>
        /// <returns>Number of records affected</returns>
        [ProducesResponseType(StatusCodes.Status202Accepted)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpDelete("")]
        public ActionResult<int> Remove()
        {
            var cUser = _context.Users.FirstOrDefault(a => a.Username == _currentUser.UserName);

            if (cUser == null)
                return NotFound();

            cUser.Active = false;
            var affectedRows = _context.SaveChanges();

            return Accepted(affectedRows);
        }
    }
}
