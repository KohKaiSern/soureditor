<script lang="ts">
	import { Heading } from 'flowbite-svelte';
	import { DropdownSearch, NumberInput } from '../UI';
	import { pokemon, items, growthRateCoefficients } from '$data';
	let { mon = $bindable() } = $props();

	const setExpForLvl = () => {
		//Formula: [1]/[2]*n**3 + [3]*n**2 + [4]*n - [5]
		const growthCFs: number[] =
			growthRateCoefficients[
				pokemon.find((pokemon) => pokemon.name === mon.species)!
					.growthRate as keyof typeof growthRateCoefficients
			];
		mon.exp = Math.max(
			0,
			Math.ceil(
				(growthCFs[0] / growthCFs[1]) * mon.level ** 3 +
					growthCFs[2] * mon.level ** 2 +
					growthCFs[3] * mon.level -
					growthCFs[4]
			)
		);
	};
</script>

<Heading tag="h6" class="mb-3">Species</Heading>
<DropdownSearch options={pokemon.map((pokemon) => pokemon.name)} bind:value={mon.species} />
<Heading tag="h6" class="mt-3 mb-3">Held Item</Heading>
<DropdownSearch
	options={[
		'NONE',
		...items
			.filter((item) => item.category != 'KEY_ITEM' && item.category != 'TM_HM')
			.map((item) => item.name)
	]}
	bind:value={mon.heldItem}
/>
<Heading tag="h6" class="mt-3 mb-3">Level</Heading>
<NumberInput bind:value={mon.level} min={1} max={100} onchange={setExpForLvl} />
