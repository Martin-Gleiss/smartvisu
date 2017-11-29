<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012 - 2015
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */


// -----------------------------------------------------------------------------
// T R A N S L A T I O N 
// -----------------------------------------------------------------------------


function get_lang($code = config_lang) {
	// read ini file
	$result = parse_ini_file(const_path.'lang/'.$code.'.ini', true);

	// recursive call to read extended language file (if specified)
	if(isset($result['extends']) && !empty($result['extends']))
		$result = array_replace_recursive(get_lang($result['extends']), $result);

	return $result;
}

/**
 * Get a language-string form the lang-file
 *
 * @param string $subset the subset of translation keys (first array dimension)
 * @param string $key    a key in that subset (secound array dimension)
 * @param string $mode   if $mode == 'obj', all values will be served as object-string
 *
 * @return string
 */
function trans($subset, $key = '', $mode = '')
{
	$ret = '';
	static $lang;

	if (!$lang)
		$lang = get_lang();

	if (is_array($lang[$subset]) && $key == '')
	{
		foreach (($lang[$subset]) as $key => $val)
		{
			if ($mode == 'obj') {
				$ret .= "'".$key ."':";
			}
			$ret .= "'".$val."', ";
		}

		if ($mode == 'obj') {
			$ret = '{'.substr($ret, 0, -2).'}';
		} else {
			$ret = '['.substr($ret, 0, -2).']';
		}
	}
	elseif (isset($lang[$subset][$key]))
		$ret = $lang[$subset][$key];

	return $ret;
}

/**
 * Translates a text
 *
 * @param string $text   the text that should be translated
 * @param string $subset the subset of translation keys
 *
 * @return string
 */
function translate($text, $subset)
{
	$ret = $text;

	static $lang;

	if (!$lang)
		$lang = get_lang();

	if (is_array($lang[$subset]))
	{
		$keys = array();
		$vals = array();

		$ret = '_'.str_replace(' ', '_', $ret).'_';

		foreach (($lang[$subset]) as $key => $val)
		{
			$keys[] = '#_'.str_replace(' ', '_', $key).'([_!\,\.])#i';
			$vals[] = '_'.$val.'$1';
		}

		$ret = trim(str_replace('_', ' ', preg_replace($keys, $vals, $ret)));
	}

	return $ret;
}

/**
 * Translates a unit
 *
 * @param string $unit a unit as string
 * @param float $value a value as float
 *
 * @return string string representation of the value
 */
function transunit($unit, $value)
{
	$fmt = trans('format', $unit);

	if (strpos($fmt, ',') !== false)
		return str_replace('.', ',', sprintf(str_replace(',', '.', $fmt), $value));
	else
		return sprintf($fmt, $value);
}


/**
 * Translates a Date and Time
 *
 * @param string $format    a format for a timestamp, based on php date function
 * @param int    $timestamp a timestamp
 *
 * @return string
 */
function transdate($format = '', $timestamp = null)
{
	$date = null;
	static $lang;

	if (!$lang)
		$lang = get_lang();

	if ($lang['format'][$format] != '')
		$format = $lang['format'][$format];

	if ($timestamp == '')
		$date = date($format);
	else
		$date = date($format, $timestamp);

	if (strpos($format, 'F') !== false)
		$date = translate($date, 'month');

	if (strpos($format, 'l') !== false)
		$date = translate($date, 'weekday');

	if (strpos($format, 'D') !== false)
		$date = translate($date, 'shortday');

	return $date;
}


// -----------------------------------------------------------------------------
// F I L E
// -----------------------------------------------------------------------------

/**
 * Infos about given file
 */
function fileinfo($file)
{
	$ret = false;

	if (is_file(const_path.$file))
	{
		@clearstatcache();
		$ret = @stat(const_path.$file);
	}

	return $ret;
}

/**
 * Read a file
 */
function fileread($file)
{
	$ret = '';

	if (is_file(const_path.$file))
	{
		$fp = fopen(const_path.$file, 'r');

		if ($fp)
		{
			while (($line = fgets($fp, 4096)) !== false)
			{
				$ret .= $line;
			}
		}

		fclose($fp);
	}

	return $ret;
}

/**
 * Write a file
 */
function filewrite($file, $ret)
{
	// add base path if file does not already start with it
	if(substr($file, 0, strlen(const_path)) !== const_path)
		$file = const_path . $file;

	$dir = dirname($file);
	if (!is_dir($dir))
		mkdir($dir, 0777, true);

	$tmpFile = tempnam($dir, basename($file));
	file_put_contents($tmpFile, $ret);

	if(file_exists($file)) {
		$stat = stat($file);
		@chmod($tmpFile, $stat['mode'] & 0777);
		@chown($tmpFile, $stat['uid']);
		@chgrp($tmpFile, $stat['gid']);
	}
	rename($tmpFile, $file);

	return $ret;
}

/**
 * Delete a directory recursively
 */
function delTree($dir) { 
	if(is_dir($dir)) {
		$files = array_diff(scandir($dir), array('.','..')); 
		foreach ($files as $file) { 
			delTree("$dir/$file"); 
		} 
		return rmdir($dir);
	}
	else if (file_exists($dir)) {
		return unlink($dir);
	}
	return null;
}

/**
 * Write array to ini file
 *
 * based on http://stackoverflow.com/a/1268642
 */
function write_ini_file($assoc_arr, $path, $has_sections=FALSE) {

	$tmpFile = tempnam(dirname($path), basename($path));

	if (!$handle = fopen($tmpFile, 'w'))
		return false;

	$success = true;

	$data = ($has_sections) ? $assoc_arr : array('' => $assoc_arr);

	foreach ($data as $section=>$values) {

		if($section != '')
			$success &= false !== fwrite($handle, '['.$section.']'.PHP_EOL);

		foreach($values as $key=>$elem) {
			if(is_array($elem))
				$key .= '[]';
			else
				$elem = array($elem);

			foreach($elem as $val)
			{
				$val = strval($val);
				if ($val !== 'true' && $val !== 'false' && (!is_int($val) || $val !== '0' && substr($val, 0, 1) === '0'))
					$val = '"'.preg_replace('/["\\\\]/', '\\\\$0', $val).'"';
				$success &= false !== fwrite($handle, $key.' = '.$val.PHP_EOL);
			}
		}
	}

	fclose($handle);

	if($success) {
		if(file_exists($path)) {
			$stat = stat($path);
			@chmod($tmpFile, $stat['mode'] & 0777);
			@chown($tmpFile, $stat['uid']);
			@chgrp($tmpFile, $stat['gid']);
		}
		$success &= rename($tmpFile, $path);
	}

	return $success;
}

?>