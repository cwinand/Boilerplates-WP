<div class="wrap">
	<h2>Fake Options</h2>
	<p>These are fake options:</p>
	<form action="options.php" method="post">
		<?php settings_fields('fake_options'); ?>
		<?php do_settings_sections('fake_options_section'); ?>
		<input type="submit" name="submit" class="button button-primary" value="Save Changes" />
	</form>
</div