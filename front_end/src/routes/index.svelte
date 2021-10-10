<script>
	import Login from '$lib/authentication/Login.svelte';
	import { goto } from '$app/navigation';

	const handleClickRedirect = () => {
		goto('signin-signup');
	};
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<button on:click={handleClickRedirect}> Sign in or Sign up </button>
