namespace InstantMessaging.Model.Interfaces
{
    /// <summary>
    /// Interface that defines the new message 
    /// </summary>
    public interface IMessagePost
    {

        /// <summary>
        /// UserId
        /// </summary>
        int UserId { get; set; }

        /// <summary>
        /// Used to store the message content
        /// </summary>
        string Content { get; set; }


        /// <summary>
        /// SessionId
        /// </summary>
        int SessionId { get; set; }
    }
}