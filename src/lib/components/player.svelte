<script lang="ts">
	import keyboards from '$data/keyboards.json';
	import type { Player } from '$parsers/types';
	import { NumberInput, RadioSelect, TextInput } from '$ui';
	import { Heading, Label } from 'flowbite-svelte';

	let { player = $bindable() }: { player: Player } = $props();
</script>

<Heading tag="h5" class="mt-5 mb-5">Player</Heading>
<div class="flex flex-wrap gap-7">
	<div class="flex flex-col gap-2">
		<Label>Name</Label>
		<TextInput bind:value={player.name} keyboard={keyboards.name} maxLength={7} />
	</div>
	<div class="flex flex-col">
		<Label class="mb-[-10px]">ID</Label>
		<NumberInput bind:value={player.id} min={0} max={65535} />
	</div>

	<div class="flex flex-col">
		<Label class="mb-[-10px]">Money</Label>
		<NumberInput bind:value={player.money} min={0} max={999999} />
	</div>
</div>
<div class="mt-3 flex flex-col gap-2">
	<Label>Gender</Label>
	<RadioSelect
		bind:value={player.gender}
		options={['MALE', 'FEMALE'].map((g) => ({ text: g, id: g }))}
	/>
</div>

<Heading tag="h5" class="mt-6 mb-5">Rival</Heading>
<div class="flex flex-wrap gap-5">
	<div class="flex flex-col gap-2">
		<Label>Name</Label>
		<TextInput bind:value={player.rivalName} keyboard={keyboards.name} maxLength={7} />
	</div>
</div>
