using Microsoft.OpenApi;
using dotenv.net;

DotEnv.Load();
var builder = WebApplication.CreateBuilder(args);

var finnhubApi = builder.Configuration["FINNHUB_API"];
var moralisApi  = builder.Configuration["MORALIS_API"];
var openAIApi = builder.Configuration["OPEN_API_KEY"];

// Services //
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddHttpClient();

builder.Services.AddScoped<FinnhubService>();
builder.Services.AddScoped<DashboardService>();

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "My API for DimeBoard",
        Version = "v1",
        Description = "The API for DimeBoard."
    });
});

var app = builder.Build();

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
    });
}

app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();

app.Run();
