<script lang="ts">
	import { Listgroup, ListgroupItem, P, Button } from 'flowbite-svelte';
	import { PlusOutline, TrashBinSolid } from 'flowbite-svelte-icons';
	import { DropdownSearch, NumberInput } from '../UI';
	import { items } from '$data';

	let { bag = $bindable(), id, capacity, category } = $props();

	const addItem = (i: number): void => {
		for (let item of items) {
			if (item.category === category) {
				bag[id].contents[i].name = item.name;
				break;
			}
		}
		bag[id].contents[i].qty = 1;
		bag[id].count += 1;
	};

	const deleteItem = (i: number): void => {
		bag[id].contents = bag[id].contents
			.slice(0, i)
			.concat(bag[id].contents.slice(i + 1))
			.concat({ name: '', qty: -1 });
		bag[id].count -= 1;
	};
</script>

<Listgroup class="mt-5">
	{#each Array(capacity) as _, i}
		<ListgroupItem class="flex w-full justify-between">
			{#if bag[id].contents[i].name}
				<div class="mt-2 mb-2 flex flex-col gap-4">
					<DropdownSearch
						options={items.filter((item) => item.category === category).map((item) => item.name)}
						bind:value={bag[id].contents[i].name}
					/>
					<P italic>{items.find((item) => item.name === bag[id].contents[i].name)?.description}</P>
				</div>
				<div class="flex flex-wrap gap-2">
					<Button class="p-2!" color="red" outline onclick={() => deleteItem(i)}>
						<TrashBinSolid class="h-6 w-6" />
					</Button>
					{#if category != 'KEY_ITEM'}
						<NumberInput bind:value={bag[id].contents[i].qty} min={1} max={99} />
					{/if}
				</div>
			{:else}
				<P class="mt-3 mb-3 p-3">Empty</P>
				{#if i === bag[id].contents.findIndex((entry: { name: string; qty: number }) => entry.qty === -1)}
					<Button class="p-2!" onclick={() => addItem(i)} color="purple">
						<PlusOutline class="h-5 w-5" />
					</Button>
				{/if}
			{/if}
		</ListgroupItem>
	{/each}
</Listgroup>
