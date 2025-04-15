namespace InstantMessaging;

/// <summary>
/// Interface that stores the current user's information
/// </summary>
public interface ICurrentUser
{
    /// <summary>
    /// Unique identifier for the user
    /// </summary>
    string UserName { get; }

    /// <summary>
    /// Stores the User's Email
    /// </summary>
    string Email { get; }

    /// <summary>
    /// User's Display Name
    /// </summary>
    string DisplayName { get; }
}