using JetBrains.Annotations;

namespace InstantMessaging.EntityFramework;

/// <summary>
/// UserSession entity
/// </summary>
[UsedImplicitly(ImplicitUseTargetFlags.WithMembers)]
public class Usersession
{
    /// <summary>
    /// UserSessionId
    /// </summary>
    public int UserSessionId { get; set; }

    /// <summary>
    /// UserId
    /// </summary>
    public int UserId { get; set; }

    /// <summary>
    /// SessionId
    /// </summary>
    public int SessionId { get; set; }

    /// <summary>
    /// CreatedOn
    /// </summary>
    public DateTime CreatedOn { get; set; }

    /// <summary>
    /// Sessions
    /// </summary>
    public virtual Session Session { get; set; } = null!;

    /// <summary>
    /// Users
    /// </summary>
    public virtual User User { get; set; } = null!;
}
