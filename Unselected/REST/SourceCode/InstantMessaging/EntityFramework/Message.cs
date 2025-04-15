using JetBrains.Annotations;

namespace InstantMessaging.EntityFramework;

/// <summary>
/// Message entity
/// </summary>
[UsedImplicitly(ImplicitUseTargetFlags.WithMembers)]
public class Message
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
    /// UserId
    /// </summary>
    public int UserId { get; set; }

    /// <summary>
    /// Content
    /// </summary>
    public string Content { get; set; } = null!;
    
    /// <summary>
    /// CreatedOn
    /// </summary>
    public DateTime CreatedOn { get; set; }

    /// <summary>
    /// IsRead
    /// </summary>
    public bool IsRead { get; set; }

    /// <summary>
    /// UserSession
    /// </summary>
    public virtual Session Session { get; set; } = null!;

    /// <summary>
    /// User
    /// </summary>
    public virtual User User { get; set; } = null!;
}
