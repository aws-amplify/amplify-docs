Use the following method to check if the current user's authentication session is still valid.   This is the recommended approach for determining whether you should display a sign in screen when your application starts.

<inline-fragment platform="android" src="~/lib/auth/fragments/android/check_authentication_state/10_checkSignInState.md"></inline-fragment>

You can determine the action of your app when Auth session expired by invoking Auth hub events:
<inline-fragment platform="android" src="~/lib/auth/fragments/android/check_authentication_state/20_sessionExpiredEvent.md"></inline-fragment>