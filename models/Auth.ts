import * as GoogleSignIn from 'expo-google-sign-in';

export enum AuthMethod {
  Google,
  CustomNickname
}

export enum AuthSignInRejectionReason {
  Cancelled
}

export class Auth {
  private static _getRandomNickname(): string {
    return 'user' + (1000 * Math.random())
  }

  private static async _signInWithGoogleAsync(): Promise<string> {
    await GoogleSignIn.signOutAsync()
    await GoogleSignIn.askForPlayServicesAsync()
    let authResult: GoogleSignIn.GoogleSignInAuthResult = await GoogleSignIn.signInAsync()
    return new Promise((res, rej) => {
      if (authResult.type === 'success') {
        if (authResult.user) {
          if (authResult.user.displayName) {
            res(authResult.user.displayName)
          } else {
            res(authResult.user.email)
          }
        } else {
          res(Auth._getRandomNickname())
        }
      } else {
        rej(AuthSignInRejectionReason.Cancelled)
      }
    })
  }

  public static async signInAsync(method: AuthMethod) {
    switch (method) {
      case AuthMethod.Google:
        return Auth._signInWithGoogleAsync()
    }
  }

  public static async signOutAsync(method: AuthMethod) {
    switch (method) {
      case AuthMethod.Google:
        return GoogleSignIn.signOutAsync()
    }
  }
}
