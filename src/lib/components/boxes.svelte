<script lang="ts">
	import MonCard from '$components/mon/mon-card.svelte';
	import boxThemes from '$data/boxThemes.json';
	import keyboards from '$data/keyboards.json';
	import type { Box, BoxMon, Player } from '$parsers/types';
	import { Combobox, TextInput, Carousel } from '$ui';
	import { Button, Card, Heading, Label } from 'flowbite-svelte';
	import { PlusOutline } from 'flowbite-svelte-icons';

	let { boxes = $bindable(), player }: { boxes: Box[]; player: Player } = $props();
	let selectedBox = $state(1);

	function onadd(): BoxMon {
		return {
			species: 'BULBASAUR',
			heldItem: 'NONE',
			moveset: ['TACKLE', 'NONE', 'NONE', 'NONE'],
			OTID: player.id,
			exp: 0,
			statExps: [0, 0, 0, 0, 0, 0],
			dvs: [0, 0, 0, 0, 0, 0],
			isEgg: false,
			PPUPs: [0, 0, 0, 0],
			happiness: 0,
			pokerus: {
				strain: 'NONE'
			},
			level: 1,
			caughtTime: 'DAY',
			caughtLevel: 1,
			caughtLocation: 'NEW BARK TOWN',
			nickname: ['B', 'U', 'L', 'B', 'A', 'S', 'A', 'U', 'R'],
			OTNickname: player.name,
			OTGender: 'MALE'
		};
	}
</script>

<header class="sticky top-0 z-10 mb-5 flex flex-wrap gap-5 bg-white pt-3 pb-4 dark:bg-gray-900">
	<div class="flex flex-col gap-2">
		<Label>Box</Label>
		<Carousel bind:value={selectedBox} min={1} max={16} />
	</div>
	<div class="flex flex-col gap-2">
		<Label>Theme</Label>
		<Combobox bind:value={boxes[selectedBox - 1].theme} options={boxThemes.map((b) => b.name)} />
	</div>
	<div class="flex flex-col gap-2">
		<Label>Name</Label>
		{#key selectedBox}
			<TextInput bind:value={boxes[selectedBox - 1].name} keyboard={keyboards.box} maxLength={9} />
		{/key}
	</div>
</header>

<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
	{#each boxes[selectedBox - 1].mons as mon, i}
		{#if !mon}
			<Card class="max-w-none p-5">
				<div class="flex min-h-[40px] items-center justify-between gap-3">
					<Heading tag="h5">Empty</Heading>
					<Button
						class="border-gray-300 p-2! hover:bg-gray-300"
						outline
						color="dark"
						onclick={() => {
							boxes[selectedBox - 1].mons[i] = onadd();
						}}><PlusOutline class="text-gray-600 dark:text-gray-400" /></Button
					>
				</div>
			</Card>
		{:else}
			<MonCard
				bind:mon={boxes[selectedBox - 1].mons[i]!}
				ondelete={() => {
					boxes[selectedBox - 1].mons[i] = null;
				}}
			/>
		{/if}
	{/each}
</div>
