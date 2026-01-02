<script lang="ts">
	import { Button, Dropdown, Search } from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';

	interface ComboboxProps {
		value: string | number;
		options: (string | number)[];
		onchange?: () => void;
		class?: string;
	}

	let {
		value = $bindable(),
		options,
		onchange = () => {},
		class: className = ''
	}: ComboboxProps = $props();

	let searchTerm = $state('');
	let isOpen = $state(false);
	const filteredOptions = $derived(
		options.filter((o: string | number) =>
			o.toString().toLowerCase().includes(searchTerm.toLowerCase())
		)
	);
</script>

<div class="flex align-middle">
	<div>
		<Button
			class="h-full bg-purple-600 dark:bg-purple-500 {className} ring-purple-300 focus:ring-4"
		>
			{value}
			<ChevronDownOutline class="ms-3 h-5 w-5" />
		</Button>
	</div>
	<Dropdown bind:isOpen class="w-65">
		<div class="p-3">
			<Search bind:value={searchTerm} size="md" />
		</div>
		<div class="max-h-60 overflow-y-auto">
			{#each filteredOptions as option}
				<Button
					color="dark"
					outline
					class="w-full justify-start rounded-none border-0 px-4 py-3 text-black dark:text-white"
					onclick={() => {
						value = option;
						searchTerm = '';
						isOpen = false;
						onchange?.();
					}}
				>
					{option}
				</Button>
			{/each}
		</div>
	</Dropdown>
</div>
