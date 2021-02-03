import * as React from 'react';
import { Button } from 'react-native';
import { Auth, AuthMethod, AuthSignInRejectionReason } from '../models/Auth';

type SignInWithGoogleProps = {
  onSuccess: (nickname: string, authMethod: AuthMethod) => void
}

export const SignInWithGoogle = (props: SignInWithGoogleProps) => {
  const signInAsync = () => {
    Auth.signInAsync(AuthMethod.Google).then(
      (nickname) => {
        props.onSuccess(nickname, AuthMethod.Google)
      },
      (reason: AuthSignInRejectionReason) => {
        switch (reason) {
          case AuthSignInRejectionReason.Cancelled:
            alert('sign in cancelled')
            break
          default:
            alert('unknown error')
            break
        }
      }
    )
  }
  return <Button onPress={signInAsync} title="Sign in with Google"/>
}
