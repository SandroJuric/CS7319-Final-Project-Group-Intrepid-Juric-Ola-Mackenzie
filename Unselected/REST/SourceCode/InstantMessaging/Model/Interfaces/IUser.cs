namespace InstantMessaging.Model.Interfaces
{
    /// <summary>
    /// Interface for User DTO
    /// </summary>
    public interface IUser
    {
        /// <summary>
        /// UserId
        /// </summary>
        int UserId { get; set; }

        /// <summary>
        /// User's display name
        /// </summary>
        string? DisplayName { get; set; }

        /// <summary>
        /// User's nickname
        /// </summary>
        string? UserName { get; set; }

        /// <summary>
        /// User's email address
        /// </summary>
        string? Email { get; set; }

        /// <summary>
        /// Indicates whether the user is online or offline
        /// </summary>
        bool Status { get; set; }

        /// <summary>
        /// User's profile picture, optional
        /// </summary>
        string? Picture { get; set; }

        /// <summary>
        /// User's account is active or not
        /// </summary>
        bool Active { get; set; }
    }
}