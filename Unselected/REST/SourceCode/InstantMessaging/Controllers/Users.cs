using InstantMessaging.Controllers.Interfaces;
using InstantMessaging.Model;
using InstantMessaging.Model.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InstantMessaging.Controllers
{
    /// <inheritdoc cref="IUsers" />
    [ApiController]
    [Route("/Users")]
    [Authorize]
    public class Users : Controller, IUsers
    {
        private readonly ICurrentUser _currentUser;
        private readonly AppContext _context;

        /// <summary>
        /// Constructor for the Users controller
        /// </summary>
        /// <param name="currentUser">Current User Context</param>
        /// <param name="context">DB Context</param>
        public Users(ICurrentUser currentUser, AppContext context)
        {
            _currentUser = currentUser;
            _context = context;
        }

        /// <summary>
        /// Create/Retrieves a user account, call this every time a user logs in
        /// </summary>
        /// <returns>User object</returns>
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpPost("Login")]
        public ActionResult<IUser> RetrieveOrCreate()
        {
            var user = _context.Users.FirstOrDefault(a => a.Username == _currentUser.UserName);

            if (user == null)
            {
                var newUser = new EntityFramework.User()
                {
                    Username = _currentUser.UserName,
                    Email = _currentUser.Email,
                    Active = true,
                    Status = false,
                    DisplayName = _currentUser.DisplayName,
                };

                user = _context.Users.Add(newUser).Entity;

                _context.SaveChanges();
            }

            if (user.Active == false)
            {
                user.Active = true;
                user.Status = true;
                _context.SaveChanges();
            }

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

            return Created("", cUser);
        }

        /// <summary>
        /// Get all current users and their status
        /// </summary>
        /// <returns>Array of sessions</returns>
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpGet("")]
        public IEnumerable<IUser> Current()
        {
            return _context.Users
                .Where(a => a.Active == true)
                .Select(a => new User
                {
                    UserId = a.UserId,
                    UserName = a.Username,
                    Email = a.Email,
                    Active = a.Active,
                    Status = a.Status,
                    Picture = a.Picture,
                    DisplayName = a.DisplayName
                });
        }
    }
}