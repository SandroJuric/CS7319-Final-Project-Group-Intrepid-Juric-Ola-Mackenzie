using JetBrains.Annotations;

namespace InstantMessaging.EntityFramework;

/// <summary>
/// Session entity
/// </summary>
[UsedImplicitly(ImplicitUseTargetFlags.WithMembers)]
public class Session
{
    /// <summary>
    /// SessionId
    /// </summary>
    public int SessionId { get; set; }

    /// <summary>
    /// CreatedOn
    /// </summary>
    public DateTime CreatedOn { get; set; }

    /// <summary>
    /// ModifiedOn
    /// </summary>
    public DateTime ModifiedOn { get; set; }

    /// <summary>
    /// User Sessions
    /// </summary>
    public virtual ICollection<Usersession> Usersessions { get; set; } = new List<Usersession>();
    /// <summary>
    /// Messages
    /// </summary>
    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();

}
