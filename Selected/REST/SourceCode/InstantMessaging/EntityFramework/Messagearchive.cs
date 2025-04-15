using JetBrains.Annotations;

namespace InstantMessaging.EntityFramework;

/// <summary>
/// MessageArchive entity
/// </summary>
[UsedImplicitly(ImplicitUseTargetFlags.WithMembers)]
public class Messagearchive
{
    /// <summary>
    /// MessageId
    /// </summary>
    public int MessageId { get; set; }

    /// <summary>
    /// SessionId
    /// </summary>
    public int SessionId { get; set; }

    /// <summary>
    /// Content
    /// </summary>
    public string Content { get; set; } = null!;

    /// <summary>
    /// CreatedOn
    /// </summary>
    public DateTime CreatedOn { get; set; }

    /// <summary>
    /// UserId
    /// </summary>
    public int UserId { get; set; }

    /// <summary>
    /// Session Archives
    /// </summary>
    public virtual Sessionarchive Session { get; set; } = null!;

    /// <summary>
    /// User
    /// </summary>
    public virtual User User { get; set; } = null!;
}
