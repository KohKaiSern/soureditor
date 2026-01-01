<script lang="ts">
	import MoveSelector from '$components/mon/move-selector.svelte';
	import moves from '$data/moves.json';
	import type { Pokemon } from '$extractors/types';
	import type { BoxMon, PartyMon } from '$parsers/types';
	import { ColoredCard, NumberInput } from '$ui';
	import { Button, Heading, Card, Label, P } from 'flowbite-svelte';
	import { PlusOutline, TrashBinSolid } from 'flowbite-svelte-icons';

	interface MovesProps {
		mon: PartyMon | BoxMon;
		species: Pokemon;
	}

	let { mon = $bindable(), species }: MovesProps = $props();

	function onadd(i: number): void {
		mon.moveset[i] = 'TACKLE';
	}

	function ondelete(i: number): void {
		mon.moveset.splice(i, 1);
		mon.moveset.push('NONE');
		mon.PPUPs[i] = 0;
		if ('currentHP' in mon) {
			mon.powerPoints[i] = 0;
		}
	}

	function resetPP(i: number): void {
		if ('currentHP' in mon) {
			mon.powerPoints[i] = Math.min(63, (data[i].powerPoints * (5 + mon.PPUPs[i])) / 5);
		}
	}

	let data = $derived(mon.moveset.map((move) => moves.find((m) => m.name === move)!));
</script>

<Heading tag="h5">Moves</Heading>
<div class="mt-7 flex w-full flex-col gap-5">
	{#each Array(4) as _, i}
		{#if mon.moveset[i] === 'NONE'}
			<Card class="min-h-40 w-full max-w-none p-5">
				<div class="flex justify-between gap-5">
					<Heading tag="h5">Empty</Heading>
					{#if mon.moveset[i - 1] != 'NONE' || i === 0}
						<Button
							class="size-11 border-gray-300 p-2! hover:bg-gray-300"
							outline
							color="dark"
							onclick={() => onadd(i)}
							><PlusOutline class="text-gray-600 dark:text-gray-400" />
						</Button>
					{/if}
				</div>
			</Card>
		{:else}
			<ColoredCard types={[data[i].type]}>
				<MoveSelector
					bind:move={mon.moveset[i]}
					data={data[i]}
					{species}
					resetPP={() => resetPP(i)}
				/>
				<div class="my-5 flex flex-wrap gap-7 sm:flex-nowrap">
					{#if 'powerPoints' in mon}
						<div class="flex w-full flex-col">
							<Label class="mb-[-10px]">Power Points</Label>
							<NumberInput
								bind:value={mon.powerPoints[i]}
								min={0}
								max={Math.min(63, (data[i].powerPoints * (5 + mon.PPUPs[i])) / 5)}
							/>
						</div>
					{/if}
					<div class="flex w-full flex-col">
						<Label class="mb-[-10px]">PP Ups Used</Label>
						<NumberInput
							bind:value={mon.PPUPs[i]}
							min={0}
							max={3}
							onchange={() => {
								if ('powerPoints' in mon) {
									if (
										mon.powerPoints[i] >
										Math.min(63, (data[i].powerPoints * (5 + mon.PPUPs[i])) / 5)
									) {
										mon.powerPoints[i] = Math.min(
											63,
											(data[i].powerPoints * (5 + mon.PPUPs[i])) / 5
										);
									}
								}
							}}
						/>
					</div>
				</div>
				<P italic class="mb-5">{data[i].description}</P>
				<div class="grid grid-cols-2 gap-3 md:grid-cols-5">
					<div>
						<Label>Base Power</Label>
						<P class="text-2xl">{data[i].basePower}</P>
					</div>
					<div>
						<Label>Accuracy</Label>
						<P class="text-2xl">{data[i].accuracy}%</P>
					</div>
					<div>
						<Label>Max PP</Label>
						<P class="text-2xl">{(data[i].powerPoints * (5 + mon.PPUPs[i])) / 5}</P>
					</div>
					<div>
						<Label>Effect Chance</Label>
						<P class="text-2xl">{data[i].effectChance}%</P>
					</div>
				</div>
				{#if mon.moveset[1] != 'NONE'}
					<div class="flex w-full justify-end">
						<Button class="size-11 p-2!" color="red" onclick={() => ondelete(i)}
							><TrashBinSolid /></Button
						>
					</div>
				{/if}
			</ColoredCard>
		{/if}
	{/each}
</div>
