<script>
	import { onDestroy } from 'svelte';
	import { failureMsg } from '../../stores/auth_store';
	export let livingTime = 'forever'; //living time can be "forever" ,time in ms.

	const removeErrorMessage = () => {
		failureMsg.set(null);
	};

	//reactive code with use of intervals
	let interval;
	let init = true;
	$: if ($failureMsg != null) {
		//console.log('i am in');
		if (livingTime != 'forever') interval = setInterval(removeErrorMessage, livingTime);
	}

	$: if ($failureMsg == null && livingTime != 'forever') {
		if (!init) {
			//console.log('i am out');
			clearInterval(interval);
		} else {
			init = false;
		}
	}
	onDestroy(() => {
		if (livingTime != 'forever') {
			//console.log('i am out');
			clearInterval(interval);
		}
		failureMsg.set(null);
	});
</script>

{#if $failureMsg}
	<p>{$failureMsg}</p>
{/if}
