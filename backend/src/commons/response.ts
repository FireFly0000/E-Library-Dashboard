export class ResponseBase {
  //[x: string]: any;
  private status_code: number;
  private message: string;
  private success: boolean;

  constructor(status_code: number, message: string, success: boolean) {
    this.status_code = status_code;
    this.message = message;
    this.success = success;
  }

  public getStatusCode() {
    return this.status_code;
  }

  public getMessage() {
    return this.message;
  }

  public getSuccess() {
    return this.success;
  }
}

export class ResponseSuccess<T> extends ResponseBase {
  private data?: T;
  constructor(
    status_code: number,
    message: string,
    success: boolean,
    data?: T
  ) {
    super(status_code, message, success);
    this.data = data;
  }
}

export class ResponseError extends ResponseBase {
  constructor(status_code: number, message: string, success: boolean) {
    super(status_code, message, success);
  }
}

export class ResponseSuccessPaginated<T> extends ResponseBase {
  private data?: T;
  private total_records: number;
  private total_pages: number;
  private page: number;
  private limit: number;

  constructor(
    status_code: number,
    message: string,
    success: boolean,
    data?: T,
    total_records?: number,
    total_pages?: number,
    page?: number,
    limit?: number
  ) {
    super(status_code, message, success);
    this.data = data;
    this.total_records = total_records || 0;
    this.total_pages = total_pages || 0;
    this.page = page || 1;
    this.limit = limit || 10;
  }
}

type TokenPayload = {
  accessToken: string;
  refreshToken: string;
};

export class ResponseWithToken extends ResponseBase {
  private data?: TokenPayload;

  constructor(
    status_code: number,
    message: string,
    success: boolean,
    data?: TokenPayload
  ) {
    super(status_code, message, success);
    this.data = data;
  }

  public getRefreshToken() {
    return this.data?.refreshToken;
  }

  public toJSON() {
    return {
      status_code: this.getStatusCode(),
      message: this.getMessage(),
      success: this.getSuccess(),
      data:
        this.data && this.data.refreshToken !== ""
          ? {
              accessToken: this.data.accessToken,
              refreshToken: this.data.refreshToken,
            }
          : this.data && this.data.refreshToken === ""
          ? {
              accessToken: this.data.accessToken,
            }
          : undefined,
    };
  }

  public clearRefreshToken() {
    if (this.data) {
      this.data.refreshToken = "";
    }
  }
}
