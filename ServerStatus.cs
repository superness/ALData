using System;

namespace ALView
{
    public class ServerStatus
    {
        /// <summary>
        /// The status's id in the database
        /// </summary>
        public int ID { get; set; }

        public string server_region { get; set; }
        public string server_identifier { get; set; }

        public string eventname { get; set; }
        public bool live { get; set; }
        public DateTime? spawn { get; set; }
        public double? x { get; set; }
        public double? y { get; set; }
        public string map { get; set; }
        public int? hp { get; set; }
        public int? max_hp { get; set; }
        public string target { get; set; }
        public DateTime lastupdate { get; set; }
    }
}
