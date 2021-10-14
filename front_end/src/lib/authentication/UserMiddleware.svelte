<script>
	import { onMount } from 'svelte';
	import { user, failureMsg } from '../../stores/auth_store';
	import { goto } from '$app/navigation';
	export let failureRedirect = null; //if it's null you don't redirect
	export let failureMsgDefault = null;
	//failureMsg store will only be updated with the value of failureMsgDefault if:
	//	1.the server sends a failureMsgData == a falsy Value
	//	2.or if there's not a jwt in the localStorage
	//->failureMsgDefault can be null that way the only way to change faulureMsg store
	//	is via server respone (failureMsgData)

	const isTokenVerified = async (jwt) => {
		try {
			//if JWT does not exist in local storage
			if (!jwt) {
				if (failureMsgDefault) {
					failureMsg.set(failureMsgDefault);
				}
				return false;
			}
			//if JWT does exist in local storage
			const response = await fetch(`http://localhost:5000/auth-api/is-verify`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json', jwt: jwt }
			});
			const parseRes = await response.json();
			//if token is valid
			//server sends back userData, token, failureMessageData
			const { userData, token, failureMsgData } = parseRes;
			if (userData || token) {
				failureMsg.set(null);
			} else if (failureMsgData) {
				failureMsg.set(failureMsgData);
			} else if (failureMsgDefault) {
				failureMsg.set(failureMsgDefault);
			}

			if (response.status == 403) {
				return false;
			} else {
				localStorage.setItem('jwt', token);
				localStorage.setItem('user', JSON.stringify(userData));
				user.set(userData);
				return true;
			}
		} catch (err) {
			console.log(err);
		}
	};

	onMount(async () => {
		if ($user) {
			return;
		}
		//if user doesn't exist (client may hit refresh)
		//Check if token exists and if it exists if it's valid
		const jwt = localStorage.getItem('jwt');
		const isVerified = await isTokenVerified(jwt);

		//Delete the code here if you want(only for educational purposes)--/
		console.log({ msg: 'user store', user_store: $user });
		console.log({ msg: 'isVerified', isVerified });
		if (!isVerified) {
			console.log({ msg: 'NOT VERIFIED - failureMsg store', failureMsg_store: $failureMsg });
		} else {
			console.log({ msg: 'VERIFIED - failureMsg store', failureMsg_store: $failureMsg });
		}
		//----------------------------------------------------------------/

		if (!isVerified && failureRedirect != null) {
			localStorage.clear();
			goto(failureRedirect);
		}
	});
</script>
