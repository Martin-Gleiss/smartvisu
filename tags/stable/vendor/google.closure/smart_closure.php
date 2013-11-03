<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */

require_once("php-closure.php");

class smartClosure extends PhpClosure
{

	function _readSources()
	{
		$code = "";
		foreach ($this->_srcs as $src)
		{

			$lines = file($src);
			foreach ($lines as $line_num => $line)
			{
				if (substr(trim($line), 0, 8) == '// TODO:')
					echo trim($line)."\n";

				if (substr(trim($line), 0, 11) != 'console.log')
					$code .= $line;
			}
			$code .= "\n\n";
		}

		return $code;
	}
}
