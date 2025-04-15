using InstantMessaging.Controllers.Interfaces;
using InstantMessaging.EntityFramework;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Message = InstantMessaging.Model.Message;
using Session = InstantMessaging.Model.Session;
using User = InstantMessaging.Model.User;

namespace InstantMessaging.Controllers
{
    /// <inheritdoc cref="ISession" />
    [ApiController]
    [Route("/Sessions")]
    [Authorize]
    public class Sessions : Controller, ISessions
    {
        private readonly ICurrentUser _currentUser;
        private readonly AppContext _context;

        /// <summary>
        /// Constructor for the Messages controller
        /// </summary>
        /// <param name="currentUser">Current User Context</param>
        /// <param name="context">DB Context</param>
        public Sessions(ICurrentUser currentUser, AppContext context)
        {
            _currentUser = currentUser;
            _context = context;
        }

        /// <summary>
        /// Create a new session
        /// </summary>
        /// <param name="userId">Pass the user id with whom you wish to create session with</param>
        /// <returns>Newly created Session object</returns>
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpPost("")]
        public ActionResult<Model.Interfaces.ISession> Create(int userId)
        {
            var current = GetExistingSession(userId);

            if (current != null)
                return Created("", current);

            var newSession = _context.Sessions.Add(new EntityFramework.Session
                {
                CreatedOn = DateTime.Now,
                ModifiedOn = DateTime.Now
            }
            ).Entity;

            _context.SaveChanges();

            _context.Usersessions.Add(CreateUserSession(userId, newSession.SessionId));
            _context.Usersessions.Add(CreateUserSession(_context.Users.First(a => a.Username == _currentUser.UserName).UserId, newSession.SessionId));

            _context.SaveChanges();
            current = GetExistingSession(userId);

            return Created("", current);
        }

        /// <summary>
        /// Delete a session
        /// </summary>
        /// <param name="id">Session ID</param>
        /// <returns>Number of records affected</returns>
        [ProducesResponseType(StatusCodes.Status202Accepted)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpDelete("{id}")]
        public ActionResult<int> Terminate(int id)
        {
            var session = _context.Sessions
                .Include(c => c.Messages)
                .Include(c => c.Usersessions)
                .FirstOrDefault(a => a.SessionId == id);

            if (session == null)
                return NotFound();

            var archiveSessions = new Sessionarchive
            {
                SessionId = session.SessionId,
                CreatedOn = session.CreatedOn,
                ArchivedOn = DateTime.Now
            };

            var messageArchives = session.Messages.Select(a => new Messagearchive
            {
                MessageId = a.MessageId,
                Content = a.Content,
                CreatedOn = a.CreatedOn,
                UserId = a.UserId,
                SessionId = a.SessionId
            });

            var userSessionArchives = session.Usersessions.Select(a => new Usersessionarchive
            {
                UserSessionId = a.UserSessionId,
                UserId = a.UserId,
                SessionId = a.SessionId,
                CreatedOn = a.CreatedOn
            });

            _context.Sessionarchives.Add(archiveSessions);
            _context.Messagearchives.AddRange(messageArchives);
            _context.Usersessionarchives.AddRange(userSessionArchives);


            _context.Sessions.Remove(session);

            _context.SaveChanges();

            return Accepted(1);
        }

        /// <summary>
        /// Get all current session the user belong to
        /// </summary>
        /// <returns>Array of Session objects</returns>
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpGet("")]
        public IEnumerable<Model.Interfaces.ISession> Current()
        {
            var currentSession = 
                from cUser in _context.Usersessions.Where(a => a.User.Username == _currentUser.UserName)
                join sessions in _context.Sessions.Include(a => a.Messages).Include(a => a.Usersessions) on cUser.SessionId equals sessions.SessionId
                select new Session
                {
                    SessionId = cUser.SessionId,
                    CreatedOn = cUser.CreatedOn,
                    ModifiedOn = cUser.Session.ModifiedOn,
                    Users = sessions.Usersessions.Select(a => new User
                    {
                        UserId = a.UserId,
                        UserName = a.User.Username,
                        Email = a.User.Email,
                        Status = a.User.Status,
                        Picture = a.User.Picture,
                        Active = a.User.Active
                    })
                    ,
                    Messages = sessions.Messages
                        .Select(a => new Message
                        {
                            MessageId = a.MessageId,
                            Content = a.Content,
                            CreatedOn = a.CreatedOn,
                            IsRead = Convert.ToBoolean(a.IsRead),
                            UserId = a.UserId
                        })
                };

            return currentSession;
        }

        /// <summary>
        /// Get all new session from the last session id
        /// </summary>
        /// <param name="lastId">Starting from what session id</param>
        /// <returns>Array of Session objects</returns>
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpGet("{lastId}")]
        public IEnumerable<Model.Interfaces.ISession> Recent(int lastId)
        {
            var currentSession =
                from cUser in _context.Usersessions.Where(a => a.User.Username == _currentUser.UserName)
                join sessions in _context.Sessions.Include(a => a.Messages).Include(a => a.Usersessions) on cUser.SessionId equals sessions.SessionId
                where cUser.SessionId > lastId
                select new Session
                {
                    SessionId = cUser.SessionId,
                    CreatedOn = cUser.CreatedOn,
                    ModifiedOn = cUser.Session.ModifiedOn,
                    Users = sessions.Usersessions.Select(a => new User
                    {
                        UserId = a.UserId,
                        Email = a.User.Email,
                        UserName = a.User.Username,
                        Status = Convert.ToBoolean(a.User.Status),
                        Picture = a.User.Picture,
                        Active = Convert.ToBoolean(a.User.Active)
                    })
                    ,
                    Messages = sessions.Messages
                        .Select(a => new Message
                        {
                            MessageId = a.MessageId,
                            Content = a.Content,
                            CreatedOn = a.CreatedOn,
                            IsRead = Convert.ToBoolean(a.IsRead),
                            UserId = a.UserId
                        })
                };

            return currentSession;
        }

        private Usersession CreateUserSession(int userId, int sessionId)
        {
            return new Usersession
            {
                UserId = userId,
                SessionId = sessionId,
                CreatedOn = DateTime.Now
            };
        }

        private Session? GetExistingSession(int userId)
        {
            var currentSession = (
                from cUser in _context.Usersessions.Where(a => a.User.Username == _currentUser.UserName)
                from targetUser in _context.Usersessions.Where(a => a.UserId == userId && a.SessionId == cUser.SessionId)
                select new Session
                {
                    SessionId = cUser.SessionId,
                    CreatedOn = cUser.CreatedOn,
                    ModifiedOn = cUser.Session.ModifiedOn,
                    Users = new List<User> {
                        new User
                        {
                            UserId = cUser.UserId,
                            UserName = cUser.User.Username,
                            Email = cUser.User.Email,
                            Status = cUser.User.Status,
                            Picture = cUser.User.Picture,
                            Active = cUser.User.Active

                        },
                        new User
                        {
                            UserId = targetUser.UserId,
                            UserName = targetUser.User.Username,
                            Email = targetUser.User.Email,
                            Status =targetUser.User.Status,
                            Picture = targetUser.User.Picture,
                            Active = targetUser.User.Active

                        }
                        }
                    ,
                    Messages = _context.Messages
                        .Where(a => a.SessionId == cUser.SessionId)
                        .OrderBy(a => a.CreatedOn)
                        .Select(a => new Message
                        {
                            MessageId = a.MessageId,
                            Content = a.Content,
                            CreatedOn = a.CreatedOn,
                            IsRead = Convert.ToBoolean(a.IsRead),
                            UserId = a.UserId
                        })
                });

            return currentSession.FirstOrDefault();
        }

    }
}
