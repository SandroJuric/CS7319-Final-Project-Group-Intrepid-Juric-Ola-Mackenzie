using JetBrains.Annotations;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace InstantMessaging;

/// <summary>
/// Extension of the operation filter for swagger
/// </summary>
[UsedImplicitly]
public class SwaggerAuthorizeCheckOperationFilter : IOperationFilter
{
    /// <summary>
    /// Apply the operation filter for swagger
    /// </summary>
    /// <param name="operation"></param>
    /// <param name="context"></param>
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        operation.Responses.Add("401", new OpenApiResponse { Description = "Unauthorized" });
        operation.Responses.Add("403", new OpenApiResponse { Description = "Forbidden" });

        operation.Security = new List<OpenApiSecurityRequirement>
        {
            new()
            {
                [
                    new OpenApiSecurityScheme {Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "auth0"}
                    }
                ] = ["openid", "profile", "user:email"]
            }
        };
    }
}