using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Services.Interfaces;

namespace Sabio.Services
{
    public class LogEntryService : ILogEntryService //Implement ILogEntryService
    {      
        readonly IDataProvider dataProvider;
        readonly Logger logger;

        public LogEntryService(IDataProvider dataProvider, Logger logger)
        {
            this.dataProvider = dataProvider;
            this.logger = logger;
           
        }
        public List<LogEntry> PostAllLogEntry(LogEntrySearchRequest model)
        {

         //  var timer = logger.StartTimer("Calling dbo.LogEntry_SelectAll");
            List <LogEntry> list = null;
            dataProvider.ExecuteCmd("dbo.LogEntry_SelectAll"
                , inputParamMapper: delegate (SqlParameterCollection
                paramCollection)
                {
                    paramCollection.AddWithValue("@showInfo", model.Info);
                    paramCollection.AddWithValue("@showWarning", model.Warning);
                    paramCollection.AddWithValue("@showError", model.Error);
                    paramCollection.AddWithValue("@Filter", model.Filter);
                    paramCollection.AddWithValue("@pageSize", model.pageSize);
                    paramCollection.AddWithValue("@pageNum", model.pageNum);
                }
                , singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    LogEntry singleItem = new LogEntry();
                    int startingIndex = 0; //startingOrdinal

                    singleItem.UserId = reader.GetSafeInt32(startingIndex++);
                    singleItem.Id = reader.GetSafeInt32(startingIndex++);
                    singleItem.DateCreated = reader.GetSafeDateTime(startingIndex++);
                    singleItem.Severity = reader.GetSafeString(startingIndex++);
                    singleItem.Message = reader.GetSafeString(startingIndex++);
                                
                    if (list == null)
                    {
                        list = new List<LogEntry>();
                    }
                    list.Add(singleItem);

                }
                );

         //   timer.Finish();
            return list;
        
        }

        public LogEntry GetById(int Id)
        {
            LogEntry singleItem = null;

            dataProvider.ExecuteCmd("dbo.LogEntry_SelectByUserId", inputParamMapper: delegate (SqlParameterCollection
                paramCollection)
            {
                paramCollection.AddWithValue("@Id", Id);
            }
            , singleRecordMapper: delegate (IDataReader reader, short set)
            {
                 singleItem = new LogEntry();
                int startingIndex = 0; //startingOrdinal

                
                singleItem.Id = reader.GetSafeInt32(startingIndex++);
                singleItem.Message = reader.GetSafeString(startingIndex++);
            }
            );
            return singleItem;
        }

        public void Update(LogEntryUpdate model)
        {
            dataProvider.ExecuteNonQuery("dbo.LogEntry_Update", inputParamMapper: delegate (SqlParameterCollection paramCollection)
               {
                   paramCollection.AddWithValue("@UserId", model.UserId);
                   paramCollection.AddWithValue("@Id", model.Id);
                   paramCollection.AddWithValue("@Message", model.Message);
               });
        }

        public int post(LogEntryRequest model)
        {
            int LogEntryId = 0;

            dataProvider.ExecuteNonQuery("dbo.LogEntry_Insert",
                inputParamMapper: delegate (SqlParameterCollection
                paramCollection)
                {
                    paramCollection.AddWithValue("@UserId", model.UserId);
                    paramCollection.AddWithValue("@Message", model.Message);
                    SqlParameter IdParameter = new SqlParameter
                    ("@Id", System.Data.SqlDbType.Int);
                    IdParameter.Direction = System.Data.ParameterDirection.Output;
                    paramCollection.Add(IdParameter);
                }, returnParameters: delegate
                  (SqlParameterCollection param)
                {
                    Int32.TryParse(param["@Id"].Value.ToString(), out LogEntryId);
                }
                );
            return LogEntryId;
        }

        public void DeactivatedLogEntry(int Id)
        {
            dataProvider.ExecuteNonQuery("dbo.LogEntry_Delete",
                inputParamMapper: delegate (SqlParameterCollection
                paramCollection)
                {
                    paramCollection.AddWithValue("@Id", Id);
                }
                );
        }   
    }
} 
