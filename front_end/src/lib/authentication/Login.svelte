<script>
	import LoginFacebook from '$lib/authentication/login-social/LoginFacebook.svelte';
	import ErrorMessage from '$lib/authentication/ErrorMessage.svelte';
</script>

<ErrorMessage livingTime={4000} />
<LoginFacebook
	appIdValue="3039541523028786"
	scopeValue="email,public_profile,user_gender,user_friends"
	redirectURL="/profile"
	facebookServerErrMsg="something went wrong - Facebook error"
	serverErrMsg="Authentication or internal error in our server"
/>
