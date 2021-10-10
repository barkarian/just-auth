<script>
	import { FacebookAuth } from '@beyonk/svelte-social-auth';
	import { user } from '../../../stores/auth_store';
	import { goto } from '$app/navigation';

	export let appIdValue;
	export let scopeValue = 'email,public_profile';

	const login = async (access_token) => {
		try {
			const response = await fetch(`http://localhost:5000/auth/facebook/token`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json', access_token: access_token }
			});
			if (response.status == 401) {
				throw '401-Authentication error';
			}
			const parseRes = await response.json();
			//set local storage and state
			const { userData, token } = parseRes;
			localStorage.clear();
			localStorage.setItem('jwt', token);
			localStorage.setItem('user', JSON.stringify(userData));
			user.set(userData);
			goto('/profile');
		} catch (err) {
			console.log(err);
		}
	};
</script>

<FacebookAuth
	appId={appIdValue}
	scope={scopeValue}
	on:auth-success={(e) => login(e.detail.accessToken)}
/>
