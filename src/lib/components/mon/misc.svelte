<script lang="ts">
	import type { BoxMon, PartyMon } from '$parsers/types';
	import { NumberInput, RadioSelect, Combobox } from '$ui';
	import { Heading, Label } from 'flowbite-svelte';

	let { mon = $bindable() }: { mon: PartyMon | BoxMon } = $props();

	//Eggs cannot have HP
	function toggleEgg(): void {
		if (mon.isEgg) {
			if ('currentHP' in mon) {
				mon.currentHP = 0;
				mon.status = { name: 'NONE' };
			}
		} else {
			if ('currentHP' in mon) {
				mon.currentHP = mon.stats[0];
			}
		}
	}
</script>

{#if mon.isEgg}
	<Heading tag="h5" class="mb-[-10px]">Hatch Cycles</Heading>
{:else}
	<Heading tag="h5" class="mb-[-10px]">Happiness</Heading>
{/if}
<NumberInput bind:value={mon.happiness} min={0} max={255} />

<Heading tag="h5" class="my-5">Is Egg</Heading>
<RadioSelect
	bind:value={mon.isEgg}
	options={[
		{ text: 'IS EGG', id: true },
		{ text: 'IS NOT EGG', id: false }
	]}
	onchange={toggleEgg}
/>

<Heading tag="h5" class="my-5">Pokerus</Heading>
<div class="mb-3 flex gap-5">
	<div class="flex flex-col gap-2">
		<Label>Strain</Label>
		<Combobox
			bind:value={mon.pokerus.strain}
			options={['NONE', ...Array.from({ length: 15 }, (_, i) => i + 1)]}
			onchange={() => {
				if (mon.pokerus.strain != 'NONE') {
					mon.pokerus.daysRemaining = (mon.pokerus.strain % 4) + 1;
				}
			}}
		/>
	</div>
	{#if mon.pokerus.strain != 'NONE'}
		<div class="flex flex-col gap-2">
			<Label>Days Remaining</Label>
			<Combobox
				bind:value={mon.pokerus.daysRemaining!}
				options={[
					'CURED',
					...Array.from({ length: (mon.pokerus.strain % 4) + 1 }, (_, i) => i + 1)
				]}
			/>
		</div>
	{/if}
</div>
