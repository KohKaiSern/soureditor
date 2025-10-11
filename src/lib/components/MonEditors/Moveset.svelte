<script lang="ts">
	import { P, Table, TableBody, TableBodyCell, TableBodyRow, Label } from 'flowbite-svelte';
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
			{#if mon.moves[i] === 'NONE'}
				<P italic class="mt-5 ml-6">This move slot is empty.</P>
			{:else}
				<div class="mt-5 ml-6 flex items-center gap-3">
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
				<Table class="mt-2" border={false}>
					<TableBody>
						<TableBodyRow>
							<TableBodyCell>
								<Label class="!text-gray-400">Base Power</Label>
								<P class="text-xl">
									{moves.find((move) => move.name === mon.moves[i])!.basePower}
								</P>
							</TableBodyCell>
							<TableBodyCell>
								<Label class="!text-gray-400">Accuracy</Label>
								<P class="text-xl">
									{moves.find((move) => move.name === mon.moves[i])!.accuracy}
								</P>
							</TableBodyCell>
						</TableBodyRow>
						<TableBodyRow>
							<TableBodyCell>
								<Label class="!text-gray-400">Power Points</Label>
								<P class="text-xl">
									{moves.find((move) => move.name === mon.moves[i])!.powerPoints}
								</P>
							</TableBodyCell>
							<TableBodyCell>
								<Label class="!text-gray-400">Effect Chance</Label>
								<P class="text-xl">
									{moves.find((move) => move.name === mon.moves[i])!.effectChance}
								</P>
							</TableBodyCell>
						</TableBodyRow>
					</TableBody>
				</Table>
			{/if}
		</div>
	{/each}
</div>
