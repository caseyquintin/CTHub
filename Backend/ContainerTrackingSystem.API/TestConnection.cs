using Microsoft.Data.SqlClient;

namespace ContainerTrackingSystem.API
{
    public class TestConnection
    {
        public static void Test()
        {
            string connectionString = "Server=LT-QUINTIN2\\\\CTHUB;Database=CTHub;User Id=api_user;Password=Containers1234!;TrustServerCertificate=True;";
            
            try
            {
                using var connection = new SqlConnection(connectionString);
                connection.Open();
                Console.WriteLine("✅ Connection successful!");
                
                using var command = new SqlCommand("SELECT @@VERSION", connection);
                var result = command.ExecuteScalar();
                Console.WriteLine($"SQL Server Version: {result}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Connection failed: {ex.Message}");
            }
        }
    }
}