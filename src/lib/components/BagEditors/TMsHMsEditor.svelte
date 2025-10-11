<script lang="ts">
	import { Checkbox } from 'flowbite-svelte';
	let { bag = $bindable() } = $props();

	let group = $state(
		bag.TMsHMs.contents
			.filter((entry: { name: string; qty: number }) => entry.qty === 1)
			.map((entry: { name: string; qty: number }) => entry.name)
	);

	const handleChange = (): void => {
		bag.TMsHMs.contents.forEach((entry: { name: string; qty: number }) => {
			entry.qty = group.includes(entry.name) ? 1 : 0;
		});
	};
</script>

<div class="mt-5 grid grid-flow-col grid-rows-19 md:grid-rows-12 lg:grid-rows-6">
	<Checkbox
		bind:group
		onchange={handleChange}
		classes={{ div: 'w-full p-4' }}
		choices={bag.TMsHMs.contents.map((entry: { name: string; qty: number }) => ({
			value: entry.name,
			label: entry.name
		}))}
	/>
</div>
