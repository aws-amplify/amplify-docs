```html
<template>
  <amplify-authenticator username-alias="email">
    <amplify-sign-up
      slot="sign-up"
      username-alias="email"
      :formFields.prop="formFields"
    ></amplify-sign-up>
    <amplify-sign-in slot="sign-in" username-alias="email"></amplify-sign-in>
  </amplify-authenticator>
</template>
```

<amplify-callout warning>
If you have <code>eslint-plugin-vue</code> configured, it will suggest you to use <code>v-slots</code> on Vue 3 or later. This is applicable to Vue component slot specification but not the web component slots. You can disable this rule to avoid the error.
</amplify-callout>

```js
<script>
export default {
  name: 'AuthWithSlots',
  data() {
    return {
      formFields: [
        {
          type: 'email',
          label: 'Custom Email Label',
          placeholder: 'Custom email placeholder',
          inputProps: { required: true, autocomplete: 'username' },
        },
        {
          type: 'password',
          label: 'Custom Password Label',
          placeholder: 'Custom password placeholder',
          inputProps: { required: true, autocomplete: 'new-password' },
        },
        {
          type: 'phone_number',
          label: 'Custom Phone Label',
          placeholder: 'Custom phone placeholder',
        },
      ]
    }
  }
}
</script>
```
