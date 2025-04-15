namespace InstantMessaging.Model.Interfaces
{
    /// <summary>
    /// Interface that defines the session model
    /// </summary>
    public interface ISession
    {
        /// <summary>
        /// Unique identifier for Sessions 
        /// </summary>
        int SessionId { get; set; }

        /// <summary>
        /// When the session was first created
        /// </summary>
        DateTime CreatedOn { get; set; }

        /// <summary>
        /// When the session was last modified
        /// </summary>
        DateTime ModifiedOn { get; set; }

        /// <summary>
        /// List of users associated with the session
        /// </summary>
        IEnumerable<IUser>? Users { get; set; }

        /// <summary>
        /// List of messages associated with the session
        /// </summary>
        IEnumerable<IMessage>? Messages { get; set; }
    }
}
