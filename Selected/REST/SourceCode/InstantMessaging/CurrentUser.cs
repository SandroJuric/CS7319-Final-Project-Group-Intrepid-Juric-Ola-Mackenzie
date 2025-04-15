using System.Security.Claims;

namespace InstantMessaging
{
    /// <summary>
    /// Interface for the Current User
    /// </summary>
    public class CurrentUser :ICurrentUser
    {
        /// <inheritdoc/>
        public string UserName { get; init; } 

        /// <inheritdoc/>
        public string Email { get; init; }

        /// <inheritdoc/>
        public string DisplayName { get; init; }
        
        /// <summary>
        /// Constructor for the Current User
        /// </summary>
        /// <param name="h">Http Context Accessor</param>
        /// <exception cref="Exception">throws exception if no claims have been received</exception>
        public CurrentUser(IHttpContextAccessor h)
        {
            var claims = h.HttpContext?.User.Claims.ToList();

            if (claims == null) throw new Exception("No Claims Attached");

            DisplayName = claims.FirstOrDefault(c => c.Type == "NickName")?.Value ?? "";
            Email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value ?? "";
            UserName = claims.FirstOrDefault(c => c.Type == "UserId")?.Value ?? throw new Exception("No UserId claim is present");
        }
    }
}
