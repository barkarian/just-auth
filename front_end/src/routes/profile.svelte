<script>
	import { user } from '../stores/auth_store';
	import UserMiddleware from '$lib/authentication/User_middleware.svelte';
</script>

<UserMiddleware failureRedirect="unauthorized" failureMsgDefault="You don't have a jwt" />
<p>Profile page</p>
<p>{JSON.stringify($user)}</p>
