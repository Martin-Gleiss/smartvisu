<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012 - 2015
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */


require_once const_path_system.'functions.php';

/**
 * This class implements a cacheing mechanism
 */
class class_cache
{
	var $file = '';

	public function __construct($id)
	{
		$set = array("[ ]u" => "_", "[äÄ]u" => "ae", "[öÖ]u" => "oe", "[üÜ]u" => "ue", "[ß]u" => "ss",
			"'[^\w\.-]'u" => "", "'(_+)'u" => "_");

		$this->file = 'temp/'.strtolower(preg_replace(array_keys($set), array_values($set), $id));
	}

	/**
	 * Check if the cache-file exists
	 */
	public function hit($duration = 60)
	{
		$infos = fileinfo($this->file);

		if ($infos["mtime"] + $duration * 60 > time())
			$ret = true;

		return $ret;
	}

	/**
	 * Read the content
	 */
	public function read()
	{
		$ret = fileread($this->file);

		return $ret;
	}

	/**
	 * Write the content
	 * If no content is given, then try to make a read instead
	 */
	public function write($ret)
	{
		if ($ret == '')
			$ret = fileread($this->file);
		else
			$ret = filewrite($this->file, $ret);

		return $ret;
	}

}

?>