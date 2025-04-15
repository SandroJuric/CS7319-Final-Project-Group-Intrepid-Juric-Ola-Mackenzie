using InstantMessaging.Controllers.Interfaces;
using InstantMessaging.Model;
using InstantMessaging.Model.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InstantMessaging.Controllers
{
    /// <inheritdoc cref="IMessages" />
    [ApiController]
    [Route("/Messages")]
    [Authorize]
    public class Messages : Controller, IMessages
    {
        private readonly ICurrentUser _currentUser;
        private readonly AppContext _context;

        /// <summary>
        /// Constructor for the Messages controller
        /// </summary>
        /// <param name="currentUser">Current User Context</param>
        /// <param name="context">DB Context</param>
        public Messages(ICurrentUser currentUser, AppContext context)
        {
            this._currentUser = currentUser;
            this._context = context;
        }


        /// <summary>
        /// Create a new message for given session
        /// </summary>
        /// <returns>Newly created Message object</returns>
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpPost("")]
        public ActionResult<IMessage> Create(MessagePost message)
        {
            var user = _context.Users.FirstOrDefault(a => a.Username == _currentUser.UserName);

            if (user == null)
                return NotFound();

            var newMessage = new EntityFramework.Message()
            {
                SessionId = message.SessionId,
                UserId = user.UserId,
                Content = message.Content,
                CreatedOn = DateTime.Now,
                IsRead = false
            };

            var messageEntity = _context.Messages.Add(newMessage).Entity;

            _context.SaveChanges();

            var msg = new Message
            {
                MessageId = messageEntity.MessageId,
                Content = messageEntity.Content,
                CreatedOn = messageEntity.CreatedOn,
                IsRead = messageEntity.IsRead,
                UserId = messageEntity.UserId
            };

            return Created("", msg);
        }

        /// <summary>
        /// Get all new messages since last time for given session
        /// </summary>
        /// <param name="lastId">From what ID</param>
        /// <param name="sessionId">Session ID</param>
        /// <returns>Array of messages</returns>
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpGet("{lastId}/session/{sessionId}")]
        public IEnumerable<IMessage> Recent(int lastId, int sessionId)
        {
            return _context.Messages
                        .Where(a => a.MessageId > lastId && a.SessionId == sessionId)
                        .OrderBy(a => a.CreatedOn)
                        .Select(a => new Message()
                        {
                            MessageId = a.MessageId,
                            UserId = a.UserId,
                            Content = a.Content,
                            CreatedOn = a.CreatedOn,
                            IsRead = Convert.ToBoolean(a.IsRead)
                        });
        }
    }
}
