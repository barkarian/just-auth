<script>
	import { user } from '../stores/auth_store';
	import UserMiddleware from '$lib/authentication/User_middleware.svelte';
</script>

<UserMiddleware failureMsgDefault={null} failureRedirect="unauthorized" />
<p>Profile page</p>
<p>{JSON.stringify($user)}</p>
