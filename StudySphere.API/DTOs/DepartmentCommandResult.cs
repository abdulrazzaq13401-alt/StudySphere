namespace StudySphere.API.DTOs
{
    public enum DepartmentCommandStatus
    {
        Success,
        ValidationFailed,
        NotFound,
        Conflict,
    }

    public class DepartmentCommandResult<T>
    {
        private DepartmentCommandResult(DepartmentCommandStatus status, T data, string errorMessage)
        {
            Status = status;
            Data = data;
            ErrorMessage = errorMessage;
        }

        public DepartmentCommandStatus Status { get; }
        public T Data { get; }
        public string ErrorMessage { get; }

        public static DepartmentCommandResult<T> Success(T data) =>
            new(DepartmentCommandStatus.Success, data, null);

        public static DepartmentCommandResult<T> ValidationFailed(string message) =>
            new(DepartmentCommandStatus.ValidationFailed, default, message);

        public static DepartmentCommandResult<T> NotFound(string message) =>
            new(DepartmentCommandStatus.NotFound, default, message);

        public static DepartmentCommandResult<T> Conflict(string message) =>
            new(DepartmentCommandStatus.Conflict, default, message);
    }
}
