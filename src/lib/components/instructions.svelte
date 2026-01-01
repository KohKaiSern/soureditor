<script lang="ts">
	import { P, Li, List } from 'flowbite-svelte';
</script>

<P class="mt-5">
	Sour Editor is a save editor for Sour Crystal. It auto-updates by scraping game files. <br />
	Contact Rev3lation on the Bowl of Soup Discord Server to report bugs (bad eggs, corrupted saves, etc).
	<br />
	I am not responsible for any corrupted saves - please backup your original saves. <br /> <br />
	Instructions for use:
</P>
<List tag="ol" class="mb-5 text-black dark:text-white">
	<Li>Upload your save file. It should be a battery save, not an emulator save state.</Li>
	<Li>Edit your save data as desired.</Li>
	<Li>
		Download the edited save and replace your original save with it. Remember to backup your
		original save.
	</Li>
	<Li>Rename your edited save to match the original one.</Li>
</List>
<P class="mb-5">
	<em class="font-italic">Credits: Rev3lation, SourApple</em><br />
	<a href="https://github.com/KohKaiSern/soureditor" class="text-blue-500 underline"
		>GitHub Repository</a
	>
</P>
