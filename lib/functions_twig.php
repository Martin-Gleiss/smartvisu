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
// Filters for Twig
// -----------------------------------------------------------------------------

function twig_concat($val, $text = '')
{
	if ($text != '')
		$val .= "_".$text;

	return $val;
}

function twig_bit($val)
{
	return ($val ? 'true' : 'false');
}

function twig_substr($val, $start, $end = null)
{
	if ($end)
		$ret = substr($val, $start, $end);
	else
		$ret = substr($val, $start);

	return $ret;
}

function twig_smartdate($val, $format = 'date')
{
	return transdate($format, $val);
}

function twig_deficon(Twig_Environment $env, $val, $def = '')
{
	$globals = $env->getGlobals();
	
	if (is_array($val))
	{
		for ($i = 0; $i < count($val); $i++)
		{
			$ret[$i] = $val[$i];

			if ($ret[$i] == '')
				$ret[$i] = $def;

			if (substr($ret[$i], -4, 4) == ".png" || substr($ret[$i], -4, 4) == ".svg" and strpos($ret[$i], "/") === false)
				$ret[$i] = $globals["icon0"].$ret[$i];
		}
	}
	else
	{
		$ret = $val;

		if ($ret == '')
			$ret = $def;

		if (substr($ret, -4, 4) == ".png" || substr($ret, -4, 4) == ".svg" and strpos($ret, "/") === false)
			$ret = $globals["icon0"].$ret;
	}
	
	return $ret;
}

function twig_md5($val)
{
	return md5($val);
}


// -----------------------------------------------------------------------------
// General functions for Twig
// -----------------------------------------------------------------------------

function twig_uid($str1, $str2 = '', $str3 = '')
{
	$ret = str_replace('.', '_', $str1.($str2 != '' ? '-'.$str2 : '').($str3 != '' ? '-'.$str3 : ''));

	return $ret;
}

function twig_once($name)
{
	$ret = false;

	static $singular = array();

	if (!isset($singular[$name]))
		$ret = true;

	$singular[$name] = true;

	return $ret;
}

function twig_isfile($file)
{
	return is_file(const_path.$file);
}

function twig_dir($dir, $filter = '(.*)')
{
	$ret = array();

	clearstatcache();

	// read directory contents
	$dirlist = dir(const_path.$dir);

	while (($item = $dirlist->read()) !== false)
	{
		if ($item != '.' and $item != '..' and $item != '.svn' and substr($item, 0, 1) != '_')
		{
			if (preg_match("#".$filter."$#i", $item, $itemparts) > 0)
			{
				$name = str_replace("_", " ", $itemparts[1]);
				$ret[$name] = array(
					"path" => $dir.'/'.$itemparts[0],
					"file" => $itemparts[0],
					"name" => $itemparts[1],
					"label" => ucfirst($name));
			}
		}
	}

	$dirlist->close();

	// sort
	ksort($ret);

	return $ret;
}

function twig_docu($filename)
{
	$ret = array();
	$rettmp = array();

	$file = file_get_contents($filename);

	// Header
	preg_match_all('#.+?@(.+?)\W+(.*)#i', substr($file, 0, strpos($file, '*/') + 2), $header);

	// Body 
	preg_match_all('#\/\*\*[\r\n](.+?)\*\/.+?\{\% macro(.+?)\%\}#is', strstr($file, '*/'), $widgets);

	if (count($widgets[2]) > 0)
	{
		foreach ($widgets[2] as $no => $macro)
		{
			preg_match_all('#(.+?)\((.+?)\)#i', $macro, $desc);
			$rettmp[$no]['name'] = trim($desc[1][0]);
			$rettmp[$no]['params'] = trim($desc[2][0]);
		}

		foreach ($widgets[1] as $no => $docu)
		{
			$rettmp[$no]['desc'] = trim(str_replace('* ', '', substr($docu, 0, strpos($docu, '@'))));
			
			if (substr($rettmp[$no]['desc'], -1, 1) == '*')
				$rettmp[$no]['desc'] = substr($rettmp[$no]['desc'], 0, -1);
			
			// Header-Tags 
			foreach ($header[1] as $headerno => $headertag)
			{
				if (!($headertag == "author" and trim($header[2][$headerno]) == "Martin Gleiß"))
					$rettmp[$no][$headertag] = trim($header[2][$headerno]);
			}

			$rettmp[$no]['subpackage'] = substr(mb_strtolower(basename($filename), 'UTF-8'), 0, -5);
			$rettmp[$no]['command'] = $rettmp[$no]['subpackage'].".".$rettmp[$no]['name'];
			$rettmp[$no]['call'] = $rettmp[$no]['command']."(".$rettmp[$no]['params'].")";

			// Widget-Tags
			preg_match_all('#.+?@(.+?)\W+(.*)#i', $docu, $tags);

			$param = 0;
			$params = explode(',', $rettmp[$no]['params']);

			foreach ($tags[1] as $id => $tag)
			{
				if ($tag == 'param')
					$rettmp[$no]['param'][trim($params[$param++])] = trim($tags[2][$id]);
				elseif ($tag == 'see')
				{
					$see = explode('#', trim($tags[2][$id]));
					$rettmp[$no]['see'][] = array("page" => $see[0], "anchor" => $see[1]);
				}
				else
					$rettmp[$no][$tag] = trim($tags[2][$id]);
			}
		}

		foreach ($rettmp as $attributes)
		{
			$ret[$attributes['subpackage'].'.'.$attributes['name']] = $attributes;
		}

		ksort($ret);
	}
	else
	{
		foreach ($header[1] as $headerno => $headertag)
		{
			if (!($headertag == "author" and trim($header[2][$headerno]) == "Martin Gleiß"))
				$ret[$headertag] = trim($header[2][$headerno]);
		}
	}

	return $ret;
}

/**
 * Get a language-string from the lang-file
 *
 * @param string $subset the subset of translation keys (first array dimension)
 * @param string $key    a key in that subset (secound array dimension)
 *
 * @return string
 */
function twig_lang($subset, $key)
{
	static $lang;

	if (!$lang)
		eval(fileread('lang/lang_'.config_lang.'.txt'));

	return $lang[$subset][$key];
}


// -----------------------------------------------------------------------------
// Special functions for Twig
// -----------------------------------------------------------------------------

function twig_implode($mixed, $suffix = '', $delimiter = '.')
{
	$ret = '';

	if (is_array($suffix))
		$suffix = $delimiter.implode($delimiter, $suffix);
	elseif ($suffix != '')
		$suffix = $delimiter.$suffix;

	if (is_array($mixed))
	{
		foreach ($mixed as $value)
		{
			$ret .= $value.$suffix.", ";
		}

		$ret = substr($ret, 0, -2);
	}
	else
		$ret = $mixed.$suffix;

	return $ret;
}

?>
