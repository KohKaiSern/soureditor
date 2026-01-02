<script lang="ts">
	import items from '$data/items.json';
	import pokemon from '$data/pokemon.json';
	import keyboards from '$data/keyboards.json';
	import type { Pokemon } from '$extractors/types';
	import type { BoxMon, PartyMon } from '$parsers/types';
	import { TextInput, NumberInput, DropdownSelect, Combobox } from '$ui';
	import { Heading, P } from 'flowbite-svelte';
	import { fixStats } from '$components/utils';

	interface BasicsProps {
		mon: PartyMon | BoxMon;
		species: Pokemon;
	}

	let { mon = $bindable(), species }: BasicsProps = $props();

	function resetMon(): void {
		if ('currentHP' in mon) {
			mon = fixStats(mon, species);
		}
		setExpForLvl();
	}

	function setExpForLvl(): void {
		mon.exp = Math.max(
			Math.floor((species.growthCFs[0] / species.growthCFs[1]) * mon.level ** 3) +
				species.growthCFs[2] * mon.level ** 2 +
				species.growthCFs[3] * mon.level -
				species.growthCFs[4],
			0
		);
	}
</script>

<Heading tag="h5">Nickname</Heading>
<TextInput bind:value={mon.nickname} maxLength={10} keyboard={keyboards.name} class="my-5" />

<Heading tag="h5">Species</Heading>
<div class="my-5 flex gap-3">
	<Combobox
		options={pokemon.map((p) => p.name).filter((p) => !'?000?Egg?256?'.includes(p))}
		bind:value={mon.species}
		onchange={resetMon}
	/>
</div>

<Heading tag="h5" class="mb-5">Held Item</Heading>
{#if 'currentHP' in mon}
	<Combobox
		options={['NONE']
			.concat(
				items
					.slice(1)
					.filter((item) => item.category != 'KEY_ITEM')
					.map((item) => item.name)
			)
			.filter((name) => !name.includes('TERU-SAMA'))
			.filter((name) => name != 'PARK BALL')}
		bind:value={mon.heldItem}
	/>
{:else}
	<Combobox
		options={['NONE']
			.concat(
				items
					.slice(1)
					.filter((item) => item.category != 'KEY_ITEM')
					.map((item) => item.name)
			)
			.filter((name) => !name.includes('MAIL'))
			.filter((name) => !name.includes('TERU-SAMA'))
			.filter((name) => name != 'PARK BALL')}
		bind:value={mon.heldItem}
	/>
{/if}
<div class="mt-5 flex items-center gap-3">
	{#if mon.heldItem === 'NONE'}
		<P italic>This Pokemon has no held item.</P>
	{:else}
		<P italic>{items.find((i) => i.name === mon.heldItem)!.description}</P>
	{/if}
</div>

<Heading tag="h5" class="mt-5 mb-[-10px]">Level</Heading>
<NumberInput
	bind:value={mon.level}
	min={1}
	max={100}
	onchange={() => {
		setExpForLvl();
		if ('stats' in mon) {
			mon = fixStats(mon, species);
		}
	}}
/>

{#if 'currentHP' in mon && !mon.isEgg}
	<Heading tag="h5" class="mt-5 mb-[-10px]">Current HP</Heading>
	<NumberInput bind:value={mon.currentHP} min={0} max={mon.stats[0]} />
	{#if mon.currentHP != 0}
		<div class="my-5 flex flex-wrap items-start gap-5 sm:flex-nowrap">
			<div>
				<Heading tag="h5" class="mb-5">Status</Heading>
				<DropdownSelect
					options={['NONE', 'PARALYSIS', 'BURN', 'FREEZE', 'POISON', 'SLEEP']}
					bind:value={mon.status.name}
					onchange={() => {
						//@ts-ignore
						if (mon.status.name === 'SLEEP') {
							//@ts-ignore
							mon.status.turnsRemaining = 1;
						}
					}}
				/>
			</div>
			{#if mon.status.name === 'SLEEP'}
				<div>
					<Heading tag="h5" class="mb-[-10px] sm:mb-0">Sleep Duration</Heading>
					<NumberInput bind:value={mon.status.turnsRemaining!} min={1} max={7} />
				</div>
			{/if}
		</div>
	{/if}
{/if}
