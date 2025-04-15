using InstantMessaging.Model.Interfaces;
using JetBrains.Annotations;

namespace InstantMessaging.Model
{
    /// <inheritdoc />
    [UsedImplicitly(ImplicitUseTargetFlags.WithMembers)]
    public class User : IUser
    {
        /// <inheritdoc />
        public int UserId { get; set; }

        /// <inheritdoc />
        public string? UserName { get; set; }

        /// <inheritdoc />
        public string? Email { get; set; }

        /// <inheritdoc />
        public bool Status { get; set; }

        /// <inheritdoc />
        public string? Picture { get; set; }

        /// <inheritdoc />
        public bool Active { get; set; }

        /// <inheritdoc />
        public string? DisplayName { get; set; }
    }
}