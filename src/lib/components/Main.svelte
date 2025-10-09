<script lang="ts">
	import {
		Heading,
		Label,
		Fileupload,
		Button,
		Helper,
		P,
		List,
		Li,
		Toast,
		RadioButton,
		ButtonGroup,
		Hr
	} from 'flowbite-svelte';
	import { blur } from 'svelte/transition';
	import { version } from '$data';
	import { type Mon, type BagSlot } from '$lib/types';
	import { buf2hex, hex2buf } from '$lib/utils';
	import { parseSave, reverseParseSave } from '$lib/components/parsers';
	import BoxEditor from './BoxEditor.svelte';

	let file: Array<File> = $state([]);
	let toastMsg = $state('');
	let mons: Mon[][] = $state([]);
	let bag: Record<string, BagSlot> = $state({});
	let selectedEditor = $state('');

	const handleSave = async () => {
		if (file[0].size > 33000 || file[0].size < 32000) {
			toastMsg =
				"This doesn't seem like a save file. Make sure it's a battery save and not a save state.";
			return;
		}
		const fileHex = buf2hex(await file[0].arrayBuffer());
		try {
			[mons, bag] = parseSave(fileHex);
		} catch (error) {
			toastMsg = `This save file failed to be parsed. Make sure that it's from Sour Crystal v${version}.`;
			return;
		}
		toastMsg = 'Save Validated!';
		setTimeout(() => {
			toastMsg = '';
		}, 3000);
	};

	const downloadSave = async () => {
		if (!file) return;
		const fileHex = buf2hex(await file[0].arrayBuffer());
		const buffer = hex2buf(reverseParseSave(fileHex, mons, bag));
		const link = URL.createObjectURL(new Blob([buffer]));
		const a = document.createElement('a');
		a.href = link;
		a.download = `${file[0].name.slice(0, -4)}_EDITED${file[0].name.slice(-4)}`;
		a.click();
	};

	$inspect(mons);
	$inspect(bag);
</script>

{#if toastMsg}
	<div transition:blur={{ amount: 10 }} class="absolute right-5 top-5">
		<Toast>
			{toastMsg}
		</Toast>
	</div>
{/if}

<Heading tag="h1" class="mb-5">Sour Editor</Heading>
<Label class="mb-2">Upload Save</Label>
<div class="mb-2 flex gap-3">
	<Fileupload bind:files={file as any} onchange={handleSave} />
	<Button color="purple" class="whitespace-nowrap" onclick={downloadSave}>Download Save</Button>
</div>
<Helper>.SAV or .SRM (Max 33kB).</Helper>
<br />
<P>
	Sour Editor is a save editor for Sour Crystal. It auto-updates by scraping game files. <br />
	Contact Rev3lation on the Bowl of Soup Discord Server to report bugs (bad eggs, corrupted saves, etc).
	<br />
	I am not responsible for any corrupted saves - please backup your original saves. <br /> <br />
	Instructions for use:
</P>
<List tag="ol" class="text-white">
	<Li>Upload your save file. It should be a battery save, not an emulator save state.</Li>
	<Li>Edit your PC Boxes and Bag Contents as desired.</Li>
	<Li
		>Download the edited save and replace your original save with it. Remember to backup your
		original save.</Li
	>
	<Li>Rename your edited save to match the original one.</Li>
</List>
<br />
<P>
	<em class="font-italic">Credits: Rev3lation, SourApple, Emi, FIQ, Darsh</em>
</P>
{#if file[0]}
	<ButtonGroup class="mt-6">
		<RadioButton
			value="boxes"
			bind:group={selectedEditor}
			checkedClass="bg-purple-500 !text-white dark:bg-purple-500 hover:bg-purple-600 dark:hover:bg-purple-600"
		>
			PC Boxes
		</RadioButton>
		<RadioButton
			value="bag"
			bind:group={selectedEditor}
			checkedClass="bg-purple-500 !text-white dark:bg-purple-500 hover:bg-purple-600 dark:hover:bg-purple-600"
		>
			Bag
		</RadioButton>
	</ButtonGroup>
{/if}
<Hr />
{#if selectedEditor === 'boxes'}<BoxEditor bind:mons />{/if}
