using api.Data;
using api.Messages;
using api.Services.Draw;
using api.Services.Hacker;
using api.Services.Trivia;
using api.Services.User;
using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Connections;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace partygame
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // services.AddDbContext<DataContext>(c => c.UseSqlite(Configuration.GetConnectionString("DefaultConnection")));
            services.AddControllers().AddNewtonsoftJson();
            services.AddAutoMapper(typeof(Startup));
            services.AddScoped<ITriviaService, TriviaService>();
            services.AddCors(options =>
            {
                // options.AddPolicy("CorsPolicy", policy =>
                // {
                //     policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:4200", "https://localhost:4200");
                // });
                options.AddPolicy("CorsPolicy", builder => builder
                    .WithOrigins("http://34.215.175.198:4200", "http://localhost:4200", "http://192.168.0.12:4200", "http://192.168.0.16:4200", "http://0.0.0.0:4200")
                    // .AllowAnyOrigin()
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                .AllowCredentials());
                // .SetIsOriginAllowed(host => true));
            });
            services.AddSignalR(options =>
           {
               options.EnableDetailedErrors = true;

           });
            // services.AddScoped<IUserService, UserService>();
            services.AddScoped<IGameService, GameService>();
            services.AddScoped<IHackerService, HackerService>();
            services.AddScoped<IDrawService, DrawService>();
            services.AddSingleton<IGameRoomService, GameRoomService>();
            services.AddSingleton<IDrawGameRoomService, DrawGameRoomService>();

            services.Configure<FormOptions>(o =>
            {
                o.ValueLengthLimit = int.MaxValue;
                o.MultipartBodyLengthLimit = int.MaxValue;
                o.MemoryBufferThreshold = int.MaxValue;
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }


            // app.UseHttpsRedirection();

            app.UseStaticFiles();

            app.UseRouting();

            app.UseCors("CorsPolicy");

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<DrawMessageHub>("/drawhub");
                endpoints.MapHub<MessageHub>("/msghub");
            });
        }
    }
}
