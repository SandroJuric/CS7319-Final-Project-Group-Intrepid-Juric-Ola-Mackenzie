using System.ComponentModel.DataAnnotations;
using JetBrains.Annotations;

namespace InstantMessaging.EntityFramework;

/// <summary>
/// User entity
/// </summary>
[UsedImplicitly(ImplicitUseTargetFlags.WithMembers)]
public class User
{
    /// <summary>
    /// UserId
    /// </summary>
    public int UserId { get; set; }

    /// <summary>
    /// Username
    /// </summary>
    public string Username { get; set; } = null!;

    /// <summary>
    /// Users
    /// </summary>
    [MaxLength(500)]
    public string? DisplayName { get; set; }

    /// <summary>
    /// Email
    /// </summary>
    public string? Email { get; set; }

    /// <summary>
    /// Status
    /// </summary>
    public bool Status { get; set; }

    /// <summary>
    /// Picture
    /// </summary>
    public string? Picture { get; set; }

    /// <summary>
    /// Active
    /// </summary>
    public bool Active { get; set; }

    /// <summary>
    /// Messages
    /// </summary>
    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();

    /// <summary>
    /// Message Archives
    /// </summary>
    public virtual ICollection<Messagearchive> Messagearchives { get; set; } = new List<Messagearchive>();

    /// <summary>
    /// Sessions Archives
    /// </summary>
    public virtual ICollection<Usersessionarchive> Usersessionarchives { get; set; } = new List<Usersessionarchive>();

    /// <summary>
    /// User Sessions
    /// </summary>
    public virtual ICollection<Usersession> Usersessions { get; set; } = new List<Usersession>();
}
