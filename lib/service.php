<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012 - 2015
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */

/**
 * This class is the base class of all services
 */
class service
{
	var $debug = false;

	var $server = '';
	var $port = 0;
	var $url = '';
	var $user = '';
	var $pass = '';

	var $data = array();
	var $error = array();

	/**
	 * constructor
	 */
	public function __construct($request)
	{
		$this->init($request);
	}

	/**
	 * initialization of some parameters
	 */
	public function init($request)
	{
		$this->debug = ($request['debug'] == 1);
		error_reporting($this->debug ? E_ALL : 0);

		$this->server = $request['server'];
		$this->port = (int)$request['port'];
		$this->url = $request['url'];
		$this->user = $request['user'];
		$this->pass = $request['pass'];
	}

	/**
	 * sets an error message
	 */
	public function error($title, $message)
	{
		$this->error[] = array('title' => $title, 'text' => $message);
	}

	/**
	 * retrieve the content
	 */
	public function run()
	{
		// get the content and store
		$this->data = array();
	}

	/**
	 * prepare the data
	 */
	public function prepare()
	{
		foreach ($this->data as $id => $ds)
		{
			true;
		}
	}

	/**
	 * get a json formatted response
	 */
	public function json()
	{
		$ret = "";

		if (count($this->error) == 0)
			$this->run();

		if (count($this->error) == 0)
		{
			$this->prepare();
			$ret = $this->data;
		}
		else
		{
			header("HTTP/1.0 500 smartVISU Service Error");
			$ret = $this->error;
		}

		$this->debug($ret, "data");

		header('Content-Type: text/json');
		return json_encode($ret);
	}

	/**
	 * print some debug information if needed
	 */
	public function debug($text, $title = "")
	{
		if ($this->debug)
		{
			echo '/*'.str_repeat("*", 78)."\n";
			if ($title)
			{
				echo $title."\n";
				echo str_repeat("-", 80)."\n";
			}
			print_r($text);
			echo "\n".str_repeat("*", 78).'*/'."\n\n";
		}
	}
}

?>
