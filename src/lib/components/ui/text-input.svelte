<script lang="ts">
	import { Button, Drawer, P } from 'flowbite-svelte';

	let {
		value = $bindable(),
		maxLength,
		keyboard,
		class: className = ''
	}: { value: string[]; maxLength: number; keyboard: string[]; class?: string } = $props();
	let showKeyboard = $state(false);
</script>

<Button
	class={`${className} text-black !ring-purple-300 dark:text-white`}
	color="dark"
	outline
	onclick={() => (showKeyboard = true)}
>
	{value.join('')}
</Button>

<Drawer placement="bottom" bind:open={showKeyboard} class="h-full p-0">
	<div class="flex h-full flex-col">
		<div class="sticky top-0 z-10 bg-white p-4 shadow-sm dark:bg-gray-800">
			<div class="mx-auto max-w-2xl">
				<P class="text-sm font-medium">
					Editing text ({value.length}/{maxLength} characters)
				</P>
				<div
					class="mt-4 rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700"
				>
					<P class="text-sm">{value.join('')}|</P>
				</div>
			</div>
		</div>

		<div class="flex-1 overflow-y-auto p-4">
			<div class="mx-auto grid max-w-2xl grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-10">
				{#each keyboard as char}
					<Button
						color="light"
						size="sm"
						class="min-h-12 p-2"
						onclick={() => {
							if (value.length < maxLength) {
								value = [...value, char];
								if (value.length >= maxLength) showKeyboard = false;
							}
						}}
					>
						<P class="text-sm">{char}</P>
					</Button>
				{/each}
			</div>
		</div>

		<div
			class="sticky bottom-0 z-10 bg-white p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] dark:bg-gray-800"
		>
			<div class="mx-auto flex max-w-2xl gap-2">
				<Button
					color="red"
					class="flex-1"
					onclick={() => {
						if (value.length > 0) {
							value = value.slice(0, -1);
						}
					}}
				>
					← Backspace
				</Button>
				<Button
					color="green"
					class="flex-1"
					disabled={value.length === 0}
					onclick={() => (showKeyboard = false)}
				>
					Done
				</Button>
			</div>
		</div>
	</div>
</Drawer>
