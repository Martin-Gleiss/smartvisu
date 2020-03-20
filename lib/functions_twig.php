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
	if (!is_array($val))
		$ret = $val == '' ? $def : $val;
	else {
	  $ret = array();
		foreach($val as $pic)
		{
	    $ret[] = $entry == '' ? $def : $pic;
		}
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
	$ret = preg_replace('/[^a-zA-Z0-9\-_]/', '_', $str1.($str2 != '' ? '-'.$str2 : '').($str3 != '' ? '-'.$str3 : ''));

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

function twig_isdir($path)
{
	return is_dir(const_path.$path);
}

function twig_dir($dir, $filter = '(.*)')
{
	$ret = array();

	clearstatcache();

	// read directory contents
	$dirlist = dir(const_path.$dir);

	while (($item = $dirlist->read()) !== false)
	{
		if (substr($item, 0, 1) != '.' and substr($item, 0, 1) != '_')
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

function twig_docu($filenames = null)
{
	if($filenames == null) {
		$filenames = array_merge(twig_dir('widgets', '(.*.\.html)'), twig_dir('dropins/widgets', '(.*.\.html)'));
		if(twig_isdir('pages/'.config_pages.'/widgets', '(.*.\.html)'))
			$filenames = array_merge($filenames, twig_dir('pages/'.config_pages.'/widgets', '(.*.\.html)'));
	}
	elseif(!is_array($filenames))
		if(twig_isfile($filenames) == false && $filenames != const_path.'widgets/icon.html')
			{
				$filenames = array($filenames);
				$filenames = array_merge(twig_dir('dropins/widgets', '(.*.\.html)'));
			}
		else
			$filenames = array($filenames);


	$ret = array();

	foreach($filenames as $filename) {

		if(is_array($filename))
			$filename = const_path.$filename['path'];
		$file = file_get_contents($filename);


		// Header
		preg_match_all('#.+?@(.+?)\W+(.*)#i', substr($file, 0, strpos($file, '*/') + 2), $header);

		// Body
		preg_match_all('#\/\*\*[\r\n]+(.+?)\*\/\s+?\{\% *macro(.+?)\%\}.*?\{\% *endmacro *\%\}#is', strstr($file, '*/'), $widgets);

		if (count($widgets[2]) > 0)
		{
			foreach ($widgets[2] as $no => $macro)
			{
				$rettmp = array();

				preg_match_all('#(.+?)\((.+?)(\)|,\s+_)#i', $macro, $desc); // param scanning ends on first param name beginning with _
				$rettmp['name'] = trim($desc[1][0]);
				$rettmp['params'] = trim($desc[2][0]);

				$docu = $widgets[1][$no];

				$rettmp['desc'] = trim(str_replace('* ', '', substr($docu, 0, strpos($docu, '@'))));

				if (substr($rettmp['desc'], -1, 1) == '*')
					$rettmp['desc'] = substr($rettmp['desc'], 0, -1);

				// Header-Tags
				foreach ($header[1] as $headerno => $headertag)
				{
					if (!($headertag == "author" and trim($header[2][$headerno]) == "Martin Gleiß"))
						$rettmp[$headertag] = trim($header[2][$headerno]);
				}

				$rettmp['subpackage'] = substr(strtolower(utf8_decode(basename($filename))), 0, -5);
				$rettmp['command'] = $rettmp['subpackage'].".".$rettmp['name'];
				$rettmp['call'] = $rettmp['command']."(".$rettmp['params'].")";

				// Widget-Tags
				$tags = preg_split('#[\r\n]+[\*\s]*@#', $docu);

				$param = 0;
				$params = explode(',', $rettmp['params']);
				$rettmp['param'] = array();

				foreach ($tags as $tagstring)
				{
					preg_match('#^(.+?)\s+({(.+?)(\[\??\])?(\(.*?\))?(=.*?)?}\s+)?(.*)$#is', $tagstring, $tag);

					if ($tag[1] == 'param')
					{
						$p = array('desc' => trim($tag[7]));
						if(trim($tag[2]) != '') { // type in doc tag available
							$p['type'] = trim($tag[3]);
							if($tag[4] == '[?]')
								$p['array_form'] = 'may';
							elseif($tag[4] == '[]')
								$p['array_form'] = 'must';
							if($tag[5] != '') {
								if($p['type'] == 'id') {
									if(substr($tag[5],1,-1) == 'nonunique')
									 $p['unique'] = false;
								}
								elseif(preg_match('#^(.*\d)\.\.(\d.*)$#is', substr($tag[5],1,-1), $range)) {
									$p['min'] = $range[1];
									$p['max'] = $range[2];
								}
								else
									$p['valid_values'] = explode(',', substr($tag[5],1,-1));
							}
							$p['optional'] = $tag[6] != '';
							if($p['optional'] && $tag[6] != '=')
								$p['default'] = substr($tag[6],1);

							// valid_values
							// array_form must may
						}
						$rettmp['param'][trim($params[$param++])] = $p;
					}
					elseif ($tag[1] == 'see')
					{
						$see = explode('#', trim($tag[7]));
						$rettmp['see'][] = array("page" => $see[0], "anchor" => $see[1]);
					}
					else
						$rettmp[$tag[1]] = trim($tag[7]);
				}

				$ret[$rettmp['subpackage'].'.'.$rettmp['name']] = $rettmp;
			}

			//ksort($ret); // as of Version 2.9: Don't sort but use order in sourcefile
		}
		else
		{
			foreach ($header[1] as $headerno => $headertag)
			{
				if (!($headertag == "author" and trim($header[2][$headerno]) == "Martin Gleiß"))
					$ret[$headertag] = trim($header[2][$headerno]);
			}
		}
	}

	return $ret;
}

/**
 * Get metadata out of a code file
 *
 * @param string $filename file path and name
 *
 * @return associative array
 */
function twig_configmeta($filename)
{
	// read file up to end of first comment
  $file = '';
	$comment_end = substr($filename, -4) == '.ini' ? '#^\s*[^;]#' : '#\*/#';
	$handle = @fopen($filename, "r");
	if($handle) {
    while(($buffer = fgets($handle, 4096)) !== false) {
      $file .= $buffer;
			if(preg_match($comment_end, $buffer) === 1)
				break;
		}
	}

	// parse tags
	preg_match_all('#.+?@(.+?)\W+(.*)#i', $file, $header, PREG_SET_ORDER);
	$ret = array('label' => null, 'hide' => array(), 'default' => array(), 'deprecated' => null);
	foreach($header as $tag) {
		if(array_key_exists($tag[1], $ret)) {
			if(is_array($ret[$tag[1]])) {
        $data = preg_split('#\s+#', $tag[2], 2);
				$ret[$tag[1]][$data[0]] = $data[1];
			}
			else
        $ret[$tag[1]] = $tag[2];
		}
	}

	// remove unused tags
	foreach($ret as $key => $val) {
		if(!isset($val) || $val == array())
			unset($ret[$key]);
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
function twig_lang($subset, $key, $subkey = null)
{
	static $lang;

	if (!$lang)
		$lang = get_lang();

	if($subkey == null)
		return $lang[$subset][$key];
	else
		return $lang[$subset][$key][$subkey];
}

/**
 * Get the configuration by source
 *
 * @param string $source the source for configuration (e.g. "global" or "page")
 *
 * @return associative array of configuration options
 */
function twig_read_config($source)
{
	$config = new config();
	return $config->get($source);
}

function twig_timezones() {
  $inlist = timezone_identifiers_list();
	$outlist = array();
	foreach($inlist as $tz) {
    $tzparts = explode('/', $tz, 2);
		$outlist[] = array('name' => $tz, 'label' => $tz, 'group' => $tzparts[0]);
	}
	return $outlist;
/*
	$map = [];
	foreach($inlist as $tz) {
    $tzparts = explode('/', $tz, 2);
		$map[$tzparts[0]][] = $tz;
	}
	return $map;
*/
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
