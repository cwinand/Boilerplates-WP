<?php 

/**
 * @package Plugin Options Boilerplate
 * @version 1.0
 */
/*
Plugin Name: Plugin Options Boilerplate
Description: A basic structure for a plugin that needs an options screen.
Author: Chris Winand
Version: 1.0
*/

class FakeOptions 
{
	public static function fake_option_menu()
	{
		add_menu_page(
			'Fake plugin options',
			'Fake Plugin',
			'manage_options',
			'fake_options',
			'FakeOptions::fake_options_view'
			);
	}

	public static function fake_options_view()
	{
		include(dirname(__FILE__) . '/views/fake_options_menu.php');
	}

	public static function fake_options_admin_init()
	{
		register_setting(
			'fake_options', //matches the settings_fields parameter
			'fake_options' //name of the options
			// 'FakeOptions::fake_options_validate' //callback for form validation
			);

		add_settings_section(
			'fake_options_main', //unique id for this section of settings
			'Main Fake Options', //this is output on page
			'FakeOptions::fake_option_section_text', //callback for html to be output
			'fake_options_section' //matches do_settings_section parameter
			);

		add_settings_field(
			'fake_options_field_one', //unique id for this field
			'Fake Option Input Field', //title for the field
			'FakeOptions::fake_option_field', //callback for html input field
			'fake_options_section', //matches do_settings_section parameter
			'fake_options_main' //matches add_settings_section uid
			);
	}

	public static function fake_option_section_text()
	{
		$output = "<p>This is a description</p>";
		echo $output;
	}

	public static function fake_option_field()
	{
		$options = get_option('fake_options'); //matches second param of register_settings
		$field = '<input id="fake_options_field_one"';
		$field .= 'name="fake_options"'; //matches second param of register_settings
		$field .= 'type="text"';
		$field .= 'value="' . $options . '"/>';
		$field .= '<p class="description">This is a description</p>';

		echo $field;
	}	
}

add_action('admin_init', array('FakeOptions', 'fake_options_admin_init'));
add_action('admin_menu', array('FakeOptions', 'fake_option_menu'));

?>
