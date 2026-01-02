<script lang="ts">
	import type { BoxMon, PartyMon } from '$parsers/types';
	import { NumberInput, TypeIcon } from '$ui';
	import { Label, Heading, P } from 'flowbite-svelte';
	import { fixStats, hpDV, isShiny } from '$components/utils';
	import pokemon from '$data/pokemon.json';
	import type { Pokemon } from '$extractors/types';

	interface StatsProps {
		mon: PartyMon | BoxMon;
		species: Pokemon;
	}

	let { mon = $bindable(), species }: StatsProps = $props();

	const typeList = [
		'FIGHTING',
		'FLYING',
		'POISON',
		'GROUND',
		'ROCK',
		'BUG',
		'GHOST',
		'STEEL',
		'FIRE',
		'WATER',
		'GRASS',
		'ELECTRIC',
		'PSYCHIC',
		'ICE',
		'DRAGON',
		'DARK'
	];

	let hiddenPowerType = $derived(typeList[4 * (mon.dvs[0] % 4) + (mon.dvs[1] % 4)]);
	let hiddenPowerBasePower = $derived.by(() => {
		const cfs = mon.dvs.map((dv: number) => (dv < 8 ? 0 : 1));
		return Math.floor(
			(5 * (cfs[3] + 2 * cfs[2] + 4 * cfs[1] + 8 * cfs[0]) + (mon.dvs[3] % 4)) / 2 + 31
		);
	});

	let gender = $derived.by(() => {
		const genderRatio = pokemon.find((pokemon) => pokemon.name === mon.species)!.genderRatio;
		if (genderRatio === null) {
			return 'Genderless';
		}
		if (mon.dvs[0] / 15 <= genderRatio / 100) {
			return 'Female';
		} else {
			return 'Male';
		}
	});
</script>

<Heading tag="h5" class="mb-5">Determinant Values</Heading>
<div class="grid grid-cols-2 gap-5 lg:grid-cols-4">
	{#each ['Atk', 'Def', 'Speed', 'Special'] as stat, i}
		<div>
			<Label class="mb-[-10px]">{stat}</Label>
			<NumberInput
				bind:value={mon.dvs[i]}
				min={0}
				max={15}
				onchange={() => {
					if ('stats' in mon) {
						mon = fixStats(mon, species);
					}
				}}
			/>
		</div>
	{/each}
	<div>
		<Label class="!text-gray-400">HP DV</Label>
		<P class="text-xl">{hpDV(mon)}</P>
	</div>
	<div>
		<Label class="!text-gray-400">Gender</Label>
		<P class="text-lg">{gender}</P>
	</div>
	<div>
		<Label class="!text-gray-400">Shininess</Label>
		<P class="text-lg">{isShiny(mon) ? 'Shiny' : 'Not Shiny'}</P>
	</div>
	<div>
		<Label class="!text-gray-400">Hidden Power</Label>
		<div class="mt-2 flex gap-3">
			<TypeIcon type={hiddenPowerType} />
			<P class="text-xl">{hiddenPowerBasePower} BP</P>
		</div>
	</div>
</div>

<Heading tag="h5" class="my-7">Stat Experience</Heading>
<div class="mb-5 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
	{#each ['HP', 'Atk', 'Def', 'Speed', 'Special'] as stat, i}
		<div>
			<Label class="mb-[-10px]">{stat}</Label>
			<NumberInput
				bind:value={mon.statExps[i]}
				min={0}
				max={65535}
				onchange={() => {
					if ('stats' in mon) {
						mon = fixStats(mon, species);
					}
				}}
			/>
		</div>
	{/each}
</div>
