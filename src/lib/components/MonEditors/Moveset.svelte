<script lang="ts">
	import { P } from 'flowbite-svelte';
	import { DropdownSearch } from '../UI';
	import { moves } from '$data';
	import { getTypeColor } from '$lib/utils';
	let { mon = $bindable() } = $props();
</script>

<div class="flex flex-col gap-5">
	{#each mon.moves as move, i}
		<div>
			<DropdownSearch
				bind:value={mon.moves[i]}
				options={['NONE', ...moves.map((move) => move.name)]}
			/>
			<div class="mt-5 flex items-center gap-3">
				<div
					class="flex size-[30px] items-center justify-center rounded-[50%]"
					style:background-color={getTypeColor(
						moves.find((move) => move.name === mon.moves[i])!.type
					)}
				>
					<img
						class="size-[60%] object-contain"
						src={`https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/5781623f147f1bf850f426cfe1874ba56a9b75ee/icons/${moves.find((move) => move.name === mon.moves[i])!.type.toLowerCase()}.svg`}
						alt={`${moves.find((move) => move.name === mon.moves[i])!.type} logo`}
					/>
				</div>
				<P italic>{moves.find((move) => move.name === mon.moves[i])!.description}</P>
			</div>
			<div class="mt-5 mb-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
				<P>Base Power: {moves.find((move) => move.name === mon.moves[i])!.basePower}</P>
				<P>Accuracy: {moves.find((move) => move.name === mon.moves[i])!.accuracy}</P>
				<P>Power Points: {moves.find((move) => move.name === mon.moves[i])!.powerPoints}</P>
				<P>Effect Chance: {moves.find((move) => move.name === mon.moves[i])!.effectChance}</P>
			</div>
		</div>
	{/each}
</div>
