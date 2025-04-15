using Google.Protobuf.WellKnownTypes;
using InstantMessagingPublisher.Controllers;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

namespace InstantMessaging;

internal static class App
{
    private static WebApplicationBuilder? _builder;
    private static WebApplication? _app;

    public static void Main(string[] args)
    {

        const string currentCorsPolicy = "_AllowSpecific";

        _builder = WebApplication.CreateBuilder(args);
        var services = _builder.Services;
        var configuration = _builder.Configuration;
        
        var connectionString = _builder.Configuration.GetSection("Connection").Value!;
        var allowedCorsUrls = _builder.Configuration.GetSection("CorsUrl:Allowed").Get<IList<string>>()!.ToArray();

        services.AddCors(options =>
            options.AddPolicy(currentCorsPolicy, builder =>
                builder.WithOrigins(allowedCorsUrls)
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials()));

        services.AddAuthentication()
            .AddJwtBearer(options =>
            {
                options.IncludeErrorDetails = true;
                options.RequireHttpsMetadata = false;
                options.Authority = configuration["Auth0:Authority"];
                options.Audience = configuration["Auth0:Audience"];
            });
        
        services.AddHttpContextAccessor();

        services.AddControllers();
        services.AddEndpointsApiExplorer();
        services.AddSignalR();
        services.AddHttpContextAccessor();
        services.AddScoped<ICurrentUser, CurrentUser>();
        services.AddDbContext<AppContext>(
            options => options.UseMySQL(connectionString)
                .EnableSensitiveDataLogging()
                .EnableDetailedErrors()
        );

        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo
            {
                Version = "v2",
                Title = "IM Service API",
                Description = "Provides REST API to the client for IM Service"
            });

            var xmlFile = Path.ChangeExtension(typeof(App).Assembly.Location, ".xml");
            options.IncludeXmlComments(xmlFile);
            
            options.EnableAnnotations();

            options.ResolveConflictingActions(x => x.First());
            options.AddSecurityDefinition("auth0", new OpenApiSecurityScheme
            {
                Type = SecuritySchemeType.OAuth2,
                BearerFormat = "JWT",
                Flows = new OpenApiOAuthFlows
                {
                    Implicit = new OpenApiOAuthFlow
                    {
                        TokenUrl = new Uri(configuration["Auth0:TokenUrl"]!),
                        AuthorizationUrl = new Uri(configuration["Auth0:AuthorizationUrl"]!),
                        Scopes = new Dictionary<string, string>
                        {
                            { "openid", "OpenId" },
                            { "user:email", "user:email" },
                        }
                    }
                }
            });

            options.OperationFilter<SwaggerAuthorizeCheckOperationFilter>();

        });

        _app = _builder.Build();
        _app.MapHub<AccountsHub>("/AccountHub");
        _app.UseSwagger()
            .UseSwaggerUI(c =>
            {
                c.OAuthAppName(configuration["Auth0:AppName"]!);
                c.OAuthClientId(configuration["Auth0:ClientId"]!);

                c.OAuthAdditionalQueryStringParams(new Dictionary<string, string>
                {
                    {
                        "audience", configuration["Auth0:Audience"]!
                    }
                });
                c.OAuthUsePkce();

            });
        _app.UseRouting();
        _app.UseHttpsRedirection();
        _app.UseAuthentication();

        _app.UseCors(currentCorsPolicy); 

        _app.UseAuthorization();
        _app.MapControllers();

        _app.Run();
    }
}