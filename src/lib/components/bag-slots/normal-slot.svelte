<script lang="ts">
	import type { Item } from '$parsers/types';
	import { NumberInput, Combobox } from '$ui';
	import { Button, Listgroup, ListgroupItem, P } from 'flowbite-svelte';
	import { PlusOutline, TrashBinSolid } from 'flowbite-svelte-icons';

	let {
		contents = $bindable(),
		capacity,
		itemList
	}: {
		contents: Item[];
		capacity: number;
		itemList: any;
	} = $props();

	const addItem = (): void => {
		contents.push({
			name: itemList[0].name,
			qty: 1
		});
	};

	const deleteItem = (i: number): void => {
		contents.splice(i, 1);
	};
</script>

<Listgroup class="mt-5">
	{#each Array(capacity) as _, i}
		<ListgroupItem class="flex w-full flex-wrap py-3 pr-7 sm:flex-nowrap sm:justify-between">
			{#if contents[i]}
				<div class="mt-2 mb-2 flex flex-col gap-4">
					<Combobox
						options={itemList.map((item: any) => item.name)}
						bind:value={contents[i].name}
					/>
					<P>{itemList.find((item: any) => item.name === contents[i].name)!.description}</P>
				</div>
				<div
					class="mr-1 flex w-full items-center justify-start gap-10 sm:ml-4 sm:w-auto sm:justify-end"
				>
					<Button class="p-2!" color="red" onclick={() => deleteItem(i)}>
						<TrashBinSolid class="h-6 w-6" />
					</Button>
					{#if itemList[0].category != 'KEY_ITEM'}
						<div class="w-60">
							<NumberInput bind:value={contents[i].qty} min={1} max={99} />
						</div>
					{/if}
				</div>
			{:else}
				<P class="mx-1 my-2 p-1">Empty</P>
				{#if contents[i - 1] || i === 0}
					<Button class="mr-1 bg-purple-600 p-2! dark:bg-purple-500" onclick={() => addItem()}>
						<PlusOutline class="h-5 w-5" />
					</Button>
				{/if}
			{/if}
		</ListgroupItem>
	{/each}
</Listgroup>
