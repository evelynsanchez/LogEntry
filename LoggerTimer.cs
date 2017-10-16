using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Diagnostics;
using Sabio.Services.Interfaces;

namespace Sabio.Services
{

    public class LoggerTimer
    {
        DateTime starter = DateTime.Now;
        // field for logger
        ILogger logger;
        // field for message
        string message;
        
          
                //the parameter is then saved to the field 
                // Logger.LogInfo = string message;

        public LoggerTimer(ILogger logger, string message)
        {
            
            // store logger
            this.logger = logger;
            // store message
            this.message = message;
        }
        //after you call timer.finish() it jumps into the finish method and it will calculate how long your code took.

        public void Finish()
        {
            // calculate time using saved date
            var startTime = DateTime.Now;            
            var finishTime = DateTime.Now;
            var elapsed = finishTime - startTime;
            
            // use logger and message to call LogInfo
            logger.LogInfo($"Call took {elapsed.TotalMilliseconds} total Milliseconds {message}");


        }

    
       
    }
}
