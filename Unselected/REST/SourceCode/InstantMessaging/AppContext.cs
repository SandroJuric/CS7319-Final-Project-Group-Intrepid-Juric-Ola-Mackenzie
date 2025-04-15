using InstantMessaging.EntityFramework;
using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;

namespace InstantMessaging;
/// <summary>
/// App Db Context
/// </summary>
[UsedImplicitly(ImplicitUseTargetFlags.WithMembers)]
public class AppContext : DbContext
{
    /// <summary>
    /// App Context Constructor
    /// </summary>
    public AppContext()
    {
    }

    /// <summary>
    /// App Context Constructor
    /// </summary>
    /// <param name="options">DbContext Options</param>
    public AppContext(DbContextOptions<AppContext> options)
        : base(options)
    {
    }

    /// <summary>
    /// Messages
    /// </summary>
    public virtual DbSet<Message> Messages { get; set; }

    /// <summary>
    /// Message Archives
    /// </summary>
    public virtual DbSet<Messagearchive> Messagearchives { get; set; }

    /// <summary>
    /// Sessions
    /// </summary>
    public virtual DbSet<Session> Sessions { get; set; }

    /// <summary>
    /// Session Archives
    /// </summary>
    public virtual DbSet<Sessionarchive> Sessionarchives { get; set; }

    /// <summary>
    /// Users
    /// </summary>
    public virtual DbSet<User> Users { get; set; }

    /// <summary>
    /// User Sessions
    /// </summary>
    public virtual DbSet<Usersession> Usersessions { get; set; }

    /// <summary>
    /// User Session Archives
    /// </summary>
    public virtual DbSet<Usersessionarchive> Usersessionarchives { get; set; }


    /// <summary>
    /// OnConfiguring
    /// </summary>
    /// <param name="optionsBuilder">builder</param>
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {

    }
    /// <summary>
    /// OnModelCreating
    /// </summary>
    /// <param name="modelBuilder"></param>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Message>(entity =>
        {
            entity.HasKey(e => e.MessageId).HasName("PRIMARY");

            entity.ToTable("message");

            entity.HasIndex(e => e.SessionId, "FK_message_sessionId");

            entity.HasIndex(e => e.UserId, "FK_message_userId");

            entity.Property(e => e.MessageId).HasColumnName("messageId");
            entity.Property(e => e.Content)
                .HasMaxLength(2000)
                .HasColumnName("content");
            entity.Property(e => e.CreatedOn)
                .HasColumnType("datetime")
                .HasColumnName("createdOn");
            entity.Property(e => e.IsRead)
                .HasColumnType("bit(1)")
                .HasColumnName("isRead");
            entity.Property(e => e.SessionId).HasColumnName("sessionId");
            entity.Property(e => e.UserId).HasColumnName("userId");

            entity.HasOne(d => d.Session).WithMany(p => p.Messages)
                .HasForeignKey(d => d.SessionId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_message_sessionId");

            entity.HasOne(d => d.User).WithMany(p => p.Messages)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_message_userId");
        });

        modelBuilder.Entity<Messagearchive>(entity =>
        {
            entity.HasKey(e => e.MessageId).HasName("PRIMARY");

            entity.ToTable("messagearchive");

            entity.HasIndex(e => e.SessionId, "FK_messageArchive_sessionId");

            entity.HasIndex(e => e.UserId, "FK_messageArchive_userId");

            entity.Property(e => e.MessageId).HasColumnName("messageId");
            entity.Property(e => e.Content)
                .HasMaxLength(2000)
                .HasColumnName("content");
            entity.Property(e => e.CreatedOn)
                .HasColumnType("datetime")
                .HasColumnName("createdOn");
            entity.Property(e => e.SessionId).HasColumnName("sessionId");
            entity.Property(e => e.UserId).HasColumnName("userId");

            entity.HasOne(d => d.Session).WithMany(p => p.Messagearchives)
                .HasForeignKey(d => d.SessionId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_messageArchive_sessionId");

            entity.HasOne(d => d.User).WithMany(p => p.Messagearchives)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_messageArchive_userId");
        });

        modelBuilder.Entity<Session>(entity =>
        {
            entity.HasKey(e => e.SessionId).HasName("PRIMARY");

            entity.ToTable("session");

            entity.Property(e => e.SessionId).HasColumnName("sessionId");
            entity.Property(e => e.CreatedOn)
                .HasColumnType("datetime")
                .HasColumnName("createdOn");
            entity.Property(e => e.ModifiedOn)
                .HasColumnType("datetime")
                .HasColumnName("modifiedOn");
        });

        modelBuilder.Entity<Sessionarchive>(entity =>
        {
            entity.HasKey(e => e.SessionId).HasName("PRIMARY");

            entity.ToTable("sessionarchive");

            entity.Property(e => e.SessionId).HasColumnName("sessionId");
            entity.Property(e => e.ArchivedOn)
                .HasColumnType("datetime")
                .HasColumnName("archivedOn");
            entity.Property(e => e.CreatedOn)
                .HasColumnType("datetime")
                .HasColumnName("createdOn");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PRIMARY");

            entity.ToTable("user");

            entity.Property(e => e.UserId).HasColumnName("userId");
            entity.Property(e => e.Active)
                .HasColumnType("bit(1)")
                .HasColumnName("active");
            entity.Property(e => e.Email)
                .HasMaxLength(500)
                .HasColumnName("email");
            entity.Property(e => e.Picture)
                .HasMaxLength(1000)
                .HasColumnName("picture");
            entity.Property(e => e.Status)
                .HasColumnType("bit(1)")
                .HasColumnName("status");
            entity.Property(e => e.Username)
                .HasMaxLength(10)
                .HasColumnName("username");
        });

        modelBuilder.Entity<Usersession>(entity =>
        {
            entity.HasKey(e => e.UserSessionId).HasName("PRIMARY");

            entity.ToTable("usersession");

            entity.HasIndex(e => e.SessionId, "FK_userSession_sessionId");

            entity.HasIndex(e => e.UserId, "FK_userSession_userId");

            entity.Property(e => e.UserSessionId).HasColumnName("userSessionId");
            entity.Property(e => e.CreatedOn)
                .HasColumnType("datetime")
                .HasColumnName("createdOn");
            entity.Property(e => e.SessionId).HasColumnName("sessionId");
            entity.Property(e => e.UserId).HasColumnName("userId");

            entity.HasOne(d => d.Session).WithMany(p => p.Usersessions)
                .HasForeignKey(d => d.SessionId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_userSession_sessionId");

            entity.HasOne(d => d.User).WithMany(p => p.Usersessions)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_userSession_userId");
        });

        modelBuilder.Entity<Usersessionarchive>(entity =>
        {
            entity.HasKey(e => e.UserSessionId).HasName("PRIMARY");

            entity.ToTable("usersessionarchive");

            entity.HasIndex(e => e.SessionId, "FK_usersessionArchive_sessionId");

            entity.HasIndex(e => e.UserId, "FK_usersessionArchive_userId");

            entity.Property(e => e.UserSessionId).HasColumnName("userSessionId");
            entity.Property(e => e.CreatedOn)
                .HasColumnType("datetime")
                .HasColumnName("createdOn");
            entity.Property(e => e.SessionId).HasColumnName("sessionId");
            entity.Property(e => e.UserId).HasColumnName("userId");

            entity.HasOne(d => d.Session).WithMany(p => p.Usersessionarchives)
                .HasForeignKey(d => d.SessionId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_usersessionArchive_sessionId");

            entity.HasOne(d => d.User).WithMany(p => p.Usersessionarchives)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_usersessionArchive_userId");
        });

        //OnModelCreatingPartial(modelBuilder);
    }

    //partial void OnModelCreatingPartial(ModelBuilder modelBuilder);

}
