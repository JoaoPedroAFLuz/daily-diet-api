interface ApiErrorProps {
  message: string;
  statusCode?: number;
}

export class ApiError {
  public readonly message: string;
  public readonly statusCode: number;

  constructor({ message, statusCode = 400 }: ApiErrorProps) {
    this.message = message;
    this.statusCode = statusCode;
  }
}
