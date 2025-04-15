using JetBrains.Annotations;

namespace InstantMessaging.EntityFramework;

/// <summary>
/// SessionArchive entity
/// </summary>
[UsedImplicitly(ImplicitUseTargetFlags.WithMembers)]
public class Sessionarchive
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
    /// ArchivedOn
    /// </summary>
    public DateTime ArchivedOn { get; set; }

    /// <summary>
    /// Message Archives
    /// </summary>
    public virtual ICollection<Messagearchive> Messagearchives { get; set; } = new List<Messagearchive>();

    /// <summary>
    /// User Session Archives
    /// </summary>
    public virtual ICollection<Usersessionarchive> Usersessionarchives { get; set; } = new List<Usersessionarchive>();
}
