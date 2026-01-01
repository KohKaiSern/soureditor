<script lang="ts">
	import { Card, Heading, Button } from 'flowbite-svelte';
	import { PlusOutline } from 'flowbite-svelte-icons';

	interface EmptyMonCardProps {
		first: Boolean;
		onadd: () => void;
	}

	let { first = false, onadd }: EmptyMonCardProps = $props();
</script>

<Card class="max-w-none border-dashed p-5">
	<div class="flex min-h-[40px] items-center justify-between gap-3">
		<Heading tag="h5">Empty</Heading>
		{#if first}
			<Button class="border-gray-300 p-2! hover:bg-gray-300" outline color="dark" onclick={onadd}
				><PlusOutline class="text-gray-600 dark:text-gray-400" />
			</Button>
		{/if}
	</div>
</Card>
