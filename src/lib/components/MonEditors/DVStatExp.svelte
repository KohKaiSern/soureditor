<script lang="ts">
	import { Label, Heading, P } from 'flowbite-svelte';
	import { NumberInput } from '../UI';
	import { pokemon } from '$data';
	import { getHiddenPowerType, getTypeColor } from '$lib/utils';
	let { mon = $bindable() } = $props();
	let hpDV = $derived(parseInt(mon.dvs.map((dv: number) => (dv % 2).toString()).join(''), 2));
	let gender = $derived.by(() => {
		const genderRatio = pokemon.find((pokemon) => pokemon.name === mon.species)!.genderRatio;
		if (genderRatio === 'NONE') {
			return 'Genderless';
		}
		if (mon.dvs[0] / 15 <= (genderRatio as number)) {
			return 'Female';
		} else {
			return 'Male';
		}
	});
	let shininess = $derived.by(() => {
		if (mon.dvs[1] != 10 || mon.dvs[2] != 10 || mon.dvs[3] != 10) {
			return 'Not Shiny';
		}
		if ([2, 3, 6, 7, 10, 11, 14, 15].includes(mon.dvs[0])) {
			return 'Shiny';
		}
		return 'Not Shiny';
	});
	let hiddenPowerType = $derived(getHiddenPowerType(4 * (mon.dvs[0] % 4) + (mon.dvs[1] % 4)));
	let hiddenPowerBasePower = $derived.by(() => {
		const cfs = mon.dvs.map((dv: number) => (dv < 8 ? 0 : 1));
		return Math.floor(
			(5 * (cfs[3] + 2 * cfs[2] + 4 * cfs[1] + 8 * cfs[0]) + (mon.dvs[3] % 4)) / 2 + 31
		);
	});
</script>

<Heading tag="h6" class="mb-3">Determinant Values</Heading>
<div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
	{#each ['Atk', 'Def', 'Speed', 'Special'] as stat, i}
		<div>
			<Label class="mb-2 text-sm">{stat}</Label>
			<NumberInput bind:value={mon.dvs[i]} min={0} max={15} />
		</div>
	{/each}
	<div>
		<Label class="!text-gray-400">HP DV</Label>
		<P class="text-xl">{hpDV}</P>
	</div>
	<div>
		<Label class="!text-gray-400">Gender</Label>
		<P class="text-lg">{gender}</P>
	</div>
	<div>
		<Label class="!text-gray-400">Shininess</Label>
		<P class="text-lg">{shininess}</P>
	</div>
	<div>
		<Label class="!text-gray-400">Hidden Power</Label>
		<div class="mt-2 flex gap-3">
			<div
				class="flex size-[30px] items-center justify-center rounded-[50%]"
				style:background-color={getTypeColor(hiddenPowerType)}
			>
				<img
					class="size-[60%] object-contain"
					src={`https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/5781623f147f1bf850f426cfe1874ba56a9b75ee/icons/${hiddenPowerType.toLowerCase()}.svg`}
					alt={`${hiddenPowerType} logo`}
				/>
			</div>
			<P class="text-xl">{hiddenPowerBasePower} BP</P>
		</div>
	</div>
</div>

<Heading tag="h6" class="mt-7 mb-3">Stat Experience</Heading>
<div class="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
	{#each ['HP', 'Atk', 'Def', 'Speed', 'Special'] as stat, i}
		<div>
			<Label class="mb-2 text-sm">{stat}</Label>
			<NumberInput bind:value={mon.statExps[i]} min={0} max={65535} />
		</div>
	{/each}
</div>
