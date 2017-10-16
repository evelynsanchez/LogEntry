using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sabio.Models.Domain;
using Sabio.Models.Requests;

namespace Sabio.Services.Interfaces
{
    public interface ILogEntryService
    {
        List<LogEntry> PostAllLogEntry(LogEntrySearchRequest model);
        LogEntry GetById(int Id);
        int post(LogEntryRequest model);
        void Update(LogEntryUpdate model);
        void DeactivatedLogEntry(int Id);
        
    }
}
