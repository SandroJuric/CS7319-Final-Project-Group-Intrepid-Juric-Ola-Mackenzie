using InstantMessaging.Model.Interfaces;
using JetBrains.Annotations;

namespace InstantMessaging.Model
{
    /// <inheritdoc />
    [UsedImplicitly(ImplicitUseTargetFlags.WithMembers)]
    public class Message : IMessage
    {
        /// <inheritdoc />
        public int MessageId { get; set; }

        /// <inheritdoc />
        public int UserId { get; set; }

        /// <inheritdoc />
        public required string Content { get; set; }

        /// <inheritdoc />
        public DateTime CreatedOn { get; set; }

        /// <inheritdoc />
        public bool IsRead { get; set; }
    }
}