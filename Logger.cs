using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sabio.Data.Providers;
using Sabio.Services.Interfaces;

namespace Sabio.Services
{
    public class Logger : ILogger //Implement ILogger
    {
        readonly IDataProvider dataProvider;

        // is encapsulating by the class and the user doesn't have to know what the number is

        public Logger(IDataProvider dataProvider)
        {
            this.dataProvider = dataProvider;
        }

        public void LogError(string message, int? userId = default(int?))
        {
            Log(3, message, userId);
        }

        public void LogInfo(string message, int? userId = default(int?))
        {
            Log(1, message, userId);
        }

        public void LogWarning(string message, int? userId = default(int?))
        {
            Log(2, message, userId);
        }

        //so the user will be able to call public loginfo  then void log will enter your loginfo in the DB
        //actually a private method 

        void Log(int severity, string message, int? userId)
        {
            // do the stored procedure call to insert the log entry

            dataProvider.ExecuteNonQuery("dbo.LogEntry_Insert",
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@UserId", userId ?? (object)DBNull.Value);
                    paramCollection.AddWithValue("@Message", message);
                    paramCollection.AddWithValue("@severityid", severity);
                    SqlParameter IdParameter = new SqlParameter("@Id", System.Data.SqlDbType.Int);
                    IdParameter.Direction = System.Data.ParameterDirection.Output;
                    paramCollection.Add(IdParameter);
                });
        }

        public LoggerTimer StartTimer(string message)
        {
            // return a new LoggerTimer, passing in message and passing in "this" as the ILogger
            //a new instance of LoggerTimer is created. 

           return new LoggerTimer(this, message);

        }
    }
}
