using InstantMessaging.Model.Interfaces;
using JetBrains.Annotations;

namespace InstantMessaging.Model
{
    /// <inheritdoc />
    [UsedImplicitly(ImplicitUseTargetFlags.WithMembers)]
    public class Session : Interfaces.ISession
    {
        /// <inheritdoc />
        public int SessionId { get; set; }

        /// <inheritdoc />
        public DateTime CreatedOn { get; set; }

        /// <inheritdoc />
        public DateTime ModifiedOn { get; set; }

        /// <inheritdoc />
        public IEnumerable<IUser>? Users { get; set; }

        /// <inheritdoc />
        public IEnumerable<IMessage>? Messages { get; set; }
    }
}