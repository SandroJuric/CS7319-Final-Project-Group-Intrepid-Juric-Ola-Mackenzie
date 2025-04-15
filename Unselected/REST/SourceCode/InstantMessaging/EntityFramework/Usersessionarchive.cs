namespace InstantMessaging.EntityFramework;

/// <summary>
/// UserSessionArchive entity
/// </summary>
public class Usersessionarchive
{
    /// <summary>
    /// UserSessionArchiveId
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
    /// Session Archives
    /// </summary>
    public virtual Sessionarchive Session { get; set; } = null!;

    /// <summary>
    /// User
    /// </summary>
    public virtual User User { get; set; } = null!;
}
