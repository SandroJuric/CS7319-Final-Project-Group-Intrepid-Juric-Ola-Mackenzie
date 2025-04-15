using InstantMessaging.Controllers.Interfaces;
using InstantMessaging.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InstantMessaging.Controllers
{
    /// <inheritdoc cref="IHistory" />
    [ApiController]
    [Route("/History")]
    [Authorize]
    public class History : Controller, IHistory
    {
        private readonly ICurrentUser _currentUser;
        private readonly AppContext _context;

        /// <summary>
        /// Constructor for the History controller
        /// </summary>
        /// <param name="currentUser">Current User Context</param>
        /// <param name="context">DB Context</param>
        public History(ICurrentUser currentUser, AppContext context)
        {
            this._currentUser = currentUser;
            this._context = context;
        }

        /// <summary>
        /// Get all historical sessions
        /// </summary>
        /// <returns>Array of sessions</returns>
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpGet("Sessions")]
        public IEnumerable<Model.Interfaces.ISession> HistoricalSessions()
        {
            return 
                from cUser in _context.Usersessionarchives.Where(a => a.User.Username == _currentUser.UserName)
                join sessions in _context.Sessionarchives
                    .Include(a => a.Messagearchives)
                    .Include(a => a.Usersessionarchives) 
                    on cUser.SessionId equals sessions.SessionId
                select new Session
                {
                    SessionId = cUser.SessionId,
                    CreatedOn = cUser.CreatedOn,
                    ModifiedOn = cUser.Session.ArchivedOn,
                    Users = sessions.Usersessionarchives.Select(a => new User
                    {
                        UserId = a.UserId,
                        UserName = a.User.Username,
                        Email = a.User.Email,
                        Status = a.User.Status,
                        Picture = a.User.Picture,
                        Active = a.User.Active
                    })
                    ,
                    Messages = sessions.Messagearchives
                        .Select(a => new Message
                        {
                            MessageId = a.MessageId,
                            Content = a.Content,
                            CreatedOn = a.CreatedOn,
                            IsRead = true,
                            UserId = a.UserId
                        })
                };
        }

        /// <summary>
        /// Delete the session from active sessions, and moves it to archive
        /// </summary>
        /// <returns>Number of records affected</returns>
        [ProducesResponseType(StatusCodes.Status202Accepted)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpDelete("Session/{id}")]
        public ActionResult<int> RemoveSession(int id)
        {
            var session = (
                from cUser in _context.Usersessionarchives.Where(a => a.User.Username == _currentUser.UserName)
                join sessions in _context.Sessionarchives on cUser.SessionId equals sessions.SessionId
                where sessions.SessionId == id
                select sessions).FirstOrDefault();

            if (session == null)
                return NotFound();

            _context.Sessionarchives.Remove(session);

            var affectedRows = _context.SaveChanges();

            return Accepted(affectedRows);
        }
    }
}
