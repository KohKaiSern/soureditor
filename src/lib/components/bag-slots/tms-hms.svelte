<script lang="ts">
	import tmhms from '$data/tmhms.json';
	import type { Item } from '$parsers/types';
	import { Checkbox } from 'flowbite-svelte';

	let { contents = $bindable() }: { contents: Item[] } = $props();

	let group = $state(
		contents
			.filter((entry: { name: string; qty: number }) => entry.qty === 1)
			.map((entry: { name: string; qty: number }) => entry.name)
	);

	const onchange = (): void => {
		contents.forEach((entry: { name: string; qty: number }) => {
			entry.qty = group.includes(entry.name) ? 1 : 0;
		});
	};
</script>

<div class="mt-5 grid grid-flow-col grid-rows-41 sm:grid-rows-27 md:grid-rows-21 lg:grid-rows-17">
	<Checkbox
		bind:group
		{onchange}
		color="purple"
		classes={{ div: 'w-full p-4' }}
		choices={contents.map((entry: { name: string; qty: number }) => ({
			value: entry.name,
			label: entry.name + ' ' + tmhms[entry.name]
		}))}
	/>
</div>
