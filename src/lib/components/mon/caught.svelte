<script lang="ts">
	import locations from '$data/locations.json';
	import keyboards from '$data/keyboards.json';
	import type { BoxMon, PartyMon } from '$parsers/types';
	import { Combobox, NumberInput, RadioSelect, TextInput } from '$ui';
	import { Heading, Label } from 'flowbite-svelte';

	let { mon = $bindable() }: { mon: PartyMon | BoxMon } = $props();
</script>

<Heading tag="h5" class="mb-5">Original Trainer</Heading>
<div class="flex gap-7">
	<div class="flex flex-col gap-2">
		<Label>Nickname</Label>
		<TextInput bind:value={mon.OTNickname} keyboard={keyboards.name} maxLength={7} />
	</div>
	<div class="flex flex-col">
		<Label class="mb-[-10px]">ID</Label>
		<NumberInput bind:value={mon.OTID} min={0} max={65535} />
	</div>
	<div class="flex flex-col gap-2">
		<Label>Gender</Label>
		<RadioSelect
			bind:value={mon.OTGender}
			options={['MALE', 'FEMALE'].map((g) => ({ id: g, text: g }))}
		/>
	</div>
</div>

<Heading tag="h5" class="mt-5 mb-5">Caught Data</Heading>
<div class="mb-5 grid grid-cols-1 gap-x-10 gap-y-5 lg:grid-cols-2">
	<div class="flex flex-col gap-2">
		<Label>Time of Day</Label>
		<RadioSelect
			bind:value={mon.caughtTime}
			options={[
				{ text: 'MORNING', id: 'MORNING' },
				{ text: 'DAY', id: 'DAY' },
				{ text: 'NIGHT', id: 'NIGHT' }
			]}
		/>
	</div>
</div>
<div class="mb-5 flex flex-col">
	<Label class="mb-[-10px]">Level</Label>
	<NumberInput bind:value={mon.caughtLevel} min={1} max={63} />
</div>
<div class="mb-3 flex flex-col gap-2">
	<Label>Location</Label>
	<Combobox bind:value={mon.caughtLocation} options={locations.map((l) => l.name)} />
</div>
