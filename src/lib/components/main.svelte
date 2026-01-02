<script lang="ts">
	import { Heading, DarkMode, Label, Fileupload, Button, Helper, Toast, Hr } from 'flowbite-svelte';
	import parseSave from '$parsers/parseSave';
	import reverseParseSave from '$parsers/reverseParseSave';
	import version from '$data/version.json';
	import type { Data } from '$parsers/types';
	import Instructions from '$components/instructions.svelte';
	import Party from '$components/party.svelte';
	import Boxes from '$components/boxes.svelte';
	import { RadioSelect } from '$ui';

	let data: Data | null = $state(null);
	let files: FileList | null = $state(null);
	let toastMsg: string = $state('');
	let toastStatus: boolean = $state(false);
	let editor: string = $state('Party');

	async function uploadSave(): Promise<void> {
		if (!files![0]) return;
		toastMsg = 'Save Validated!';
		if (files![0].size < 32000 || files![0].size > 33000) {
			toastMsg =
				"This doesn't seem like a save file. Make sure that it isn't an emulator save state.";
		}
		try {
			data = parseSave(new Uint8Array(await files![0].arrayBuffer()));
		} catch (error) {
			console.log(error);
			toastMsg = `Please ensure that your save is from v${version.version} Please report this to Rev3lation.`;
		}
		toastStatus = true;
		if (toastMsg === 'Save Validated!') {
			setTimeout(() => {
				toastStatus = false;
			}, 5000);
		}
		return;
	}

	async function downloadSave(): Promise<void> {
		if (!files![0]) return;
		Object.assign(document.createElement('a'), {
			href: URL.createObjectURL(
				new Blob([
					reverseParseSave(new Uint8Array(await files![0].arrayBuffer()), data!)
						.buffer as ArrayBuffer
				])
			),
			download: `${files![0].name.slice(0, files![0].name.lastIndexOf('.'))}_EDITED${files![0].name.slice(files![0].name.lastIndexOf('.'))}`
		}).click();
	}

	$inspect(data);
</script>

<Toast
	params={{ x: 200, duration: 800 }}
	{toastStatus}
	class="w-max-64 absolute top-4 right-4 z-10 w-fit"
>
	{toastMsg}
</Toast>

<header class="mb-5 flex flex-wrap justify-between gap-5">
	<Heading tag="h1">
		<span class="text-purple-600 dark:text-purple-500">Sour</span> Editor
	</Heading>
	<DarkMode class="size-10 outline-1 outline-gray-100 focus:outline-solid dark:outline-gray-700" />
</header>

<Label for="save" class="pb-2">Upload Save</Label>
<div class="mb-2 flex gap-5 text-nowrap">
	<Fileupload id="save" accept=".srm,.sav,.SaveRAM" bind:files onchange={uploadSave} />
	<Button onclick={downloadSave} class="bg-purple-600 dark:bg-purple-500">Download Save</Button>
</div>
<Helper>.SRM / .SAV / .SaveRAM (Max. 33kB).</Helper>

<Instructions />

{#if data}
	<RadioSelect
		bind:value={editor}
		options={['Party', 'Boxes', 'Bag', 'Player'].map((e) => ({ id: e, text: e }))}
	/>
	<Hr class="my-5" />
	{#if editor === 'Party'}<Party bind:party={data.party} player={data.player} />{/if}
	{#if editor === 'Boxes'}<Boxes bind:boxes={data.boxes} player={data.player} />{/if}
	<!-- {#if editor === 'Bag'}<Bag bind:bag={data.bag} {PF} />{/if} -->
	<!-- {#if editor === 'Player'}<Player bind:player={data.player} />{/if} -->
{/if}
