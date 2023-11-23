#pragma warning disable 8601, 8618

using System.Diagnostics;
using MySql.Data.MySqlClient;
using Microsoft.AspNetCore.Mvc;
using MyWebApp.Models;

namespace MyWebApp.Controllers;

public class MatzipController : Controller
{
    public IActionResult Index(String keyword) {
        
        string gugun = keyword;
        string connStr = "Server=proj.mysql.database.azure.com;" +
                        "Database=cloud;" + 
                        "Uid=azure;" +
                        "Pwd=user123!;";

        List<Data> list = new List<Data>();
        
        using (MySqlConnection conn = new MySqlConnection(connStr)) {

            conn.Open();
            string sql = "SELECT * FROM matzip WHERE gugun LIKE '" + gugun + "%' ";

            MySqlCommand cmd = new MySqlCommand(sql, conn);
            MySqlDataReader rdr = cmd.ExecuteReader();

            while (rdr.Read()) {
                list.Add(new Data() {
                    name = rdr["name"].ToString(),
                    gugun = rdr["gugun"].ToString(),
                    lat = Convert.ToDouble(rdr["lat"]),
                    lng = Convert.ToDouble(rdr["lng"]),
                    addr = rdr["addr"].ToString(),
                    tel = rdr["tel"].ToString(),
                    time = rdr["time"].ToString(),
                    menu = rdr["menu"].ToString()
                });
            }
            rdr.Close();
        }
        return View(list);
    } 
}