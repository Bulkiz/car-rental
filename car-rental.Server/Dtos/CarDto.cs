namespace car_rental.Server.Dtos
{
    public class CarDto
    {
        public int Id { get; set; }
        public string? Make { get; set; }
        public string? Model { get; set; }
        public string? EngineType { get; set; }
        public string? TransmissionType { get; set; }
        public int Seats { get; set; }
        public int Doors { get; set; }
        public bool AirConditioner { get; set; }
        public int UserOwnerId { get; set; }
        public decimal PricePerDay { get; set; }
        public string? Location { get; set; }
        public IFormFile? PictureFile { get; set; }
        public string? PictureBase64 { get; set; }
        public DateOnly InsertDate { get; set; }
    }
}
