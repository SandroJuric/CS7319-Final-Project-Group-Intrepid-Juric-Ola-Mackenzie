namespace InstantMessaging.Model.Interfaces
{
    /// <summary>
    /// Interface that defines the message model
    /// </summary>
    public interface IMessage
    {
        /// <summary>
        /// Unique identifier for the message
        /// </summary>
        int MessageId { get; set; }

        /// <summary>
        /// UserId
        /// </summary>
        int UserId { get; set; }

        /// <summary>
        /// Used to store the message content
        /// </summary>
        string Content { get; set; }

        /// <summary>
        /// When was the message sent
        /// </summary>
        DateTime CreatedOn { get; set; }

        /// <summary>
        /// Has the message been read by the recipient
        /// </summary>
        bool IsRead { get; set; }
    }
}