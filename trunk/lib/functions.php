<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */


// -----------------------------------------------------------------------------
// T R A N S L A T I O N 
// -----------------------------------------------------------------------------

/**
 * Get a language-string form the lang-file
 *
 * @param string $subset the subset of translation keys (first array dimension)
 * @param string $key    a key in that subset (secound array dimension)
 *
 * @return string
 */
function trans($subset, $key = '', $withKeys = false)
{
	$ret = '';
	static $lang;

	if (!$lang)
		eval(fileread('lang/lang_'.config_lang.'.txt'));

	if (is_array($lang[$subset]) && $key == '')
	{
		foreach (($lang[$subset]) as $thisKey =>$val)
		{
            if ($withKeys) {
                $ret .= $thisKey .':';
            }
			$ret .= "'".$val."', ";
		}
        if ($withKeys) {
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
 * Easy translate function
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
		eval(fileread('lang/lang_'.config_lang.'.txt'));

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
 * Date and Time
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
		eval(fileread('lang/lang_'.config_lang.'.txt'));

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

/**
 * Convert to lang-based float
 *
 * @param float $float a number as float
 *
 * @return string string representation of the number
 */
function transfloat($float)
{
	$fmt = trans('format', 'float');

	if (strpos($fmt, ',') !== false)
		return str_replace('.', ',', sprintf(str_replace(',', '.', $fmt), $float));
	else
		return sprintf($fmt, $float);
}

/**
 * Convert to lang-based float
 *
 * @param float $temp a temperature as float
 *
 * @return string string representation of the temperature
 */
function transtemp($temp)
{
	$fmt = trans('format', 'temp');

	if (strpos($fmt, ',') !== false)
		return str_replace('.', ',', sprintf(str_replace(',', '.', $fmt), $temp));
	else
		return sprintf($fmt, $temp);
}

/**
 * Convert to lang-based float
 *
 * @param float $speed a speed as float
 *
 * @return string string representation of the speed
 */
function transspeed($speed)
{
    $fmt = trans('format', 'speed');

    if (strpos($fmt, ',') !== false)
        return str_replace('.', ',', sprintf(str_replace(',', '.', $fmt), $speed));
    else
        return sprintf($fmt, $speed);
}

/**
 * Convert to unit
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
	$fp = fopen(const_path.$file, 'w');

	if ($fp !== false)
	{
		fwrite($fp, $ret);
		fclose($fp);
	}

	return $ret;
}

?>
