<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Stefan Widmer
 * @copyright   2016
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */

/**
 * This class implements a caching mechanism
 */
class Pagecache
{
	var $file = '';
	var $tmpFile = null;

	public function __construct($file, $docache = true)
	{
		if($docache) {
			$this->file = $file;
			$this->read();
		}
	}

	public function __destruct()
	{
		$this->close();
	}

	/**
	 * Read the content
	 */
	public function read()
	{
		if(!empty($this->file) && file_exists($this->file)) { // requested file does exist in cache
			$mtime = (int)@filemtime($this->file);
		  $gmt_mtime = gmdate('D, d M Y H:i:s', $mtime) . ' GMT';
		  $etag = sprintf('%08x-%08x', crc32($this->file), $mtime);

		  header('ETag: "' . $etag . '"');
		  header('Last-Modified: ' . $gmt_mtime);
		  header_remove('Expires'); // we don't send an "Expires:" header to make clients/browsers use if-modified-since and/or if-none-match

		  if (@strtotime($_SERVER['HTTP_IF_MODIFIED_SINCE']) >= strtotime($gmt_mtime)) {
		    $exploded = explode(';', $_SERVER['HTTP_IF_NONE_MATCH']); // IE fix!
		  	if(empty($_SERVER['HTTP_IF_NONE_MATCH']) || !empty($exploded[0]) && strtotime($exploded[0]) == strtotime($gmt_mtime) || str_replace(array('\"', '"'), '', $_SERVER['HTTP_IF_NONE_MATCH']) == $etag) {
		      header('HTTP/1.1 304 Not Modified');
		      exit;
				}
			}

		 	readfile($this->file);
    	exit;
		}
	}

	/**
	 * Write the content to file
	 */
	public function write($content)
	{
		$this->filewrite($content);
		$this->close();
	}

	/**
	 * Append the content to file
	 */
	public function append($content)
	{
		$this->filewrite($content);
	}

	/**
	 * Overwrite the original file, afterwards no further appending is possible
	 */
	public function close()
	{
		if(!empty($this->tmpFile) && file_exists($this->tmpFile)) {
			rename($this->tmpFile, $this->file);
			$this->read();
		}
	}


	/**
	 * Do the actual writing
	 */
	private function filewrite($content)
	{
		if(!empty($this->file)) {

			if(empty($this->tmpFile)) {
			  $dir = dirname($this->file);

			  if (!is_dir($dir))
			    mkdir($dir, 0775, true);

				$this->tmpFile = tempnam($dir, basename($file));
			}

		  file_put_contents($this->tmpFile, $content, FILE_APPEND);
		}
		else {
      echo $content;
		}
	}

}
?>
