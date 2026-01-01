<script lang="ts">
	import { Button, ButtonGroup, Input } from 'flowbite-svelte';
	import { AngleLeftOutline, AngleRightOutline } from 'flowbite-svelte-icons';

	let {
		value = $bindable(),
		min,
		max,
		class: className = ''
	}: {
		value: number;
		min: number;
		max: number;
		class?: string;
	} = $props();

	const increment = () => (value === max ? (value = min) : value++);
	const decrement = () => (value === min ? (value = max) : value--);
	const enforce = () => {
		if (typeof value != 'number') value = max;
		if (!Number.isInteger(value)) value = max;
		if (value < min || value > max) value = max;
	};
</script>

<ButtonGroup class={className}>
	<Button
		type="button"
		onclick={() => {
			decrement();
		}}
		class="border-0 bg-purple-600 p-2! hover:bg-purple-600 focus:ring-4 focus:!ring-purple-300 dark:bg-purple-500 hover:dark:bg-purple-500"
	>
		<AngleLeftOutline class="size-6 text-white" />
	</Button>
	<Input
		bind:value
		onfocusout={() => {
			enforce();
		}}
		class="!w-12 text-center focus:border-transparent focus:ring-4 focus:!ring-purple-300"
	/>
	<Button
		type="button"
		onclick={() => {
			increment();
		}}
		class="border-0 bg-purple-600 p-2! hover:bg-purple-600 focus:ring-4 focus:!ring-purple-300 dark:bg-purple-500 hover:dark:bg-purple-500"
	>
		<AngleRightOutline class="size-6 text-white" />
	</Button>
</ButtonGroup>
