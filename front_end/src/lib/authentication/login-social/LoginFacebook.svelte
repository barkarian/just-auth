<script>
	import { FacebookAuth } from '@beyonk/svelte-social-auth';
	import { user, failureMsg } from '../../../stores/auth_store';
	import { goto } from '$app/navigation';
	//PROPS
	export let appIdValue;
	export let scopeValue = 'email,public_profile';
	export let redirectURL = null; //if null don't redirect
	//failureMsg store value will get one of those Messages
	export let facebookErrMsg = 'something went wrong - facebook side'; //if null don't set a failureMsg
	export let serverErrMsg = 'Authentication or internal error in our server'; //if null don't set a failureMsg

	const authFailure = () => {
		if (facebookErrMsg) {
			failureMsg.set(facebookErrMsg);
		}
	};

	const login = async (access_token) => {
		try {
			const response = await fetch(`http://localhost:5000/auth-api/facebook/token`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json', access_token: access_token }
			});
			if (response.status == 401 || response.status == 500) {
				//change the code here if you want
				if (serverErrMsg) {
					failureMsg.set(serverErrMsg);
				}
				return;
			}
			const parseRes = await response.json();
			//set local storage and state
			const { userData, token } = parseRes;
			localStorage.clear();
			localStorage.setItem('jwt', token);
			localStorage.setItem('user', JSON.stringify(userData));
			user.set(userData);
			if (redirectURL) {
				goto(redirectURL);
			}
		} catch (err) {
			console.log(err);
		}
	};
</script>

<FacebookAuth
	appId={appIdValue}
	scope={scopeValue}
	on:auth-success={(e) => login(e.detail.accessToken)}
	on:auth-failure={() => authFailure()}
/>
