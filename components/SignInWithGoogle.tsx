import { FontAwesome } from '@expo/vector-icons';
import * as React from 'react';
import { Text, Pressable } from 'react-native';
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
  return (
    <Pressable style={{ padding: 8, backgroundColor: '#0099ff' }} onPress={signInAsync}>
      <Text style={{ color: '#fff' }}><FontAwesome name="google" size={16} color="white" /> Sign in with Google</Text>
    </Pressable>
  )
}
