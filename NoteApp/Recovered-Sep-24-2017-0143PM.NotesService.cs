using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Configuration;
using NoteApp.Domain;
using System.Data;
using NoteApp.Request;

namespace NoteApp.Service
{
    public class NotesService : INotesService
    {
        public List<Notes> GetAll()
        {
            using (var con = new SqlConnection(ConfigurationManager.ConnectionStrings["NotesDbConnection"].ConnectionString))
            {
                con.Open();
                var cmd = con.CreateCommand();
                cmd.CommandText = "dbo.notes_SelectAll";
                cmd.CommandType = System.Data.CommandType.StoredProcedure;

                using (var reader = cmd.ExecuteReader())
                {

                    var results = new List<Notes>();
                    while (reader.Read())
                    {
                        results.Add(new Notes
                        {
                            Id = (int)reader["Id"],
                            title = (string)reader["title"],
                            description = (string)reader["description"],
                            dateAdded = (DateTime)reader["dateAdded"]

                        });
                    }

                    return results;
                }

            }
        }


        public Notes GetById(int Id)
        {
            using (var con = new SqlConnection(ConfigurationManager.ConnectionStrings["NotesDbConnection"].ConnectionString))
            {
                con.Open();
                var cmd = con.CreateCommand();
                cmd.CommandText = "dbo.notes_SelectById";
                cmd.CommandType = System.Data.CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@Id", Id);

                SqlParameter idParameter = new SqlParameter("@Id", SqlDbType.Int);
                idParameter.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(idParameter);

                cmd.ExecuteNonQuery();
                int Id = (int)idParameter.Value;
                return Id;
            }
        }


        public int Post(NotesRequest model)
        {
            using (var con = new SqlConnection(ConfigurationManager.ConnectionStrings["NotesDbConnection"].ConnectionString))
            {
                con.Open();
                var cmd = con.CreateCommand();
                cmd.CommandText = "dbo.notes_Insert";
                cmd.CommandType = System.Data.CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@title", model.title);
                cmd.Parameters.AddWithValue("@description", model.description);

                SqlParameter idParameter = new SqlParameter("@Id", SqlDbType.Int);
                idParameter.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(idParameter);

                cmd.ExecuteNonQuery();
                int Id = (int)idParameter.Value;
                return Id;
            }
        }

        public void Update(NotesUpdate model, int Id)
        {
            using (var con = new SqlConnection(ConfigurationManager.ConnectionStrings["NotesDbConnection"].ConnectionString))
            {
                con.Open();
                var cmd = con.CreateCommand();
                cmd.CommandText = "dbo.notes_Update";
                cmd.CommandType = System.Data.CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@title", model.title);
                cmd.Parameters.AddWithValue("@description", model.description);
                cmd.Parameters.AddWithValue("@Id", Id);

                cmd.ExecuteNonQuery();
            }
        }
        public void DeleteNotes(int Id)
        {
            using (var con = new SqlConnection(ConfigurationManager.ConnectionStrings["NotesDbConnection"].ConnectionString))
            {
                con.Open();
                var cmd = con.CreateCommand();
                cmd.CommandText = "dbo.notes_Delete";
                cmd.CommandType = System.Data.CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@Id", Id);

                cmd.ExecuteNonQuery();
            }
        }
    }
}