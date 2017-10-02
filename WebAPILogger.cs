using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http.ExceptionHandling;
using Sabio.Services.Interfaces;

namespace Sabio.Services
{
   public class WebAPILogger :  ExceptionLogger
    {
        private readonly ILogger logger;
        readonly IAuthenticationService authService;

        public WebAPILogger(ILogger logger, IAuthenticationService authService)
        {
            this.logger = logger;
            this.authService = authService;
        }

        public override void Log(ExceptionLoggerContext context)
        {
            var user = authService.GetCurrentUser();

            logger.LogError(string.Format("Unhandled exception processing {0} for {1} {2}",
                context.Request.Method,
                context.Request.RequestUri,
                context.Exception), user?.Id);

            //null reference exception when no user is logged in
           

            

        }
    }
}
