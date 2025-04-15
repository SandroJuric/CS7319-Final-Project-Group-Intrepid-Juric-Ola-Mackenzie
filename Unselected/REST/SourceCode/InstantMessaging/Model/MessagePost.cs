using InstantMessaging.Model.Interfaces;
using JetBrains.Annotations;

namespace InstantMessaging.Model
{
    /// <inheritdoc />
    [UsedImplicitly(ImplicitUseTargetFlags.WithMembers)]
    public class MessagePost : IMessagePost
    {
        /// <inheritdoc />
        public int UserId { get; set; }

        /// <inheritdoc />
        public required string Content { get; set; }

        /// <inheritdoc />
        public int SessionId { get; set; }
    }
}