// this class will be the object that stores user Authentication, Authorization, and personal lists

export class SiteUser {
  // public userCredentials: UserCredentials = null;
  // public userAuthorizations: UserRoles = null;
  // public authResponseData: UserAuthData = null;
  // public userStocks?: UserStocks = null;

  constructor(public userCredentials: UserCredentials,
    public userAuthorizations: UserRoles,
    public userStocks: string[] = []) { }

  // constructor(credentials: UserCredentials,
  //   authorizations: UserAuthorizations,
  //   stocks: UserStocks,
  //   authResData?: AuthResponseData) {
  //   this.userCredentials = credentials;
  //   this.userAuthorizations = authorizations;
  //   this.userStocks = stocks;
  //   this.authResponseData = authResData;
  // }

  // addCredentials(email: string, displayName: string, userId: string, _token: string, _tokenExpirationDate: Date) {
  //   this.userCredentials = new UserCredentials(email, displayName, userId, _token, _tokenExpirationDate);
  // }

  // addRoles(enabled: boolean, admin: boolean, editor: boolean, subscriber: boolean) {
  //   this.userAuthorizations = new UserRoles(enabled, admin, editor, subscriber);
  // }

  addStock(symbol: string) {
    if (this.userStocks === null) {
      this.userStocks = [symbol];
    } else {
      //add the stock to the existing array
      this.userStocks = [...this.userStocks, symbol];
    }
  }

  addStockArray(symbols: string[]) {
    this.userStocks = symbols;
  }

  // addAuthResponseData(idToken: string, email: string, refreshToken: string, expiresIn: string,
  //   localId: string, registered?: boolean, kind?: string, expirationDate?: Date) {
  //   this.authResponseData = new UserAuthData(idToken,
  //     email,
  //     refreshToken,
  //     expiresIn,
  //     localId,
  //     registered,
  //     kind,
  //     expirationDate);
  // }

}

export class UserCredentials{
  // email: string;
  // password: string;
  // friendlyName: string;
  constructor(public email: string,
    public displayName: string,
    public userId: string,
    private _token: string,
    private _tokenExpirationDate: Date) { }

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }
  }

  // roles will include: subscriber, admin, editor
export class UserRoles {
  constructor(
    public enabled: boolean,
    public admin: boolean,
    public editor: boolean,
    public subscriber: boolean) { }
  }

export class UserStocks {
  constructor(public symbols: string[]) { }
}

export class UserAuthData {
  constructor(
    public idToken: string,
    public email: string,
    public refreshToken: string,
    public expiresIn: string,
    public localId: string,
    public registered?: boolean,
    public kind?: string,
    public expirationDate?: Date) { }
}

//this is for a google firebase response
export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}
