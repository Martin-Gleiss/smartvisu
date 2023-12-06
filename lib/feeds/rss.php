<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012 - 2015
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */


require_once '../../lib/includes.php';
require_once const_path_system.'service.php';
require_once const_path_system.'class_cache.php';


/**
 * This class generates a weather
 */
class rss extends service
{
	var $url = '';
	var $limit = 10;

	/**
	 * initialization of some parameters
	 */
	public function init($request)
	{
		parent::init($request);

		$this->url = $request['url'];

		if ((int)$request['limit'] > 0)
			$this->limit = (int)$request['limit'];
	}

	/**
	 * retrieve the content
	 */
	public function run()
	{
		// api call 
		$cache = new class_cache('rss_'.strtolower($this->url));

		if ($cache->hit())
			$xml = simplexml_load_string($cache->read());
		else
			$xml = simplexml_load_string($cache->write(file_get_contents('https://'.$this->url)));

		if ($xml)
		{
			$i = 1;

			// the entries
			foreach ($xml->channel->item as $item)
			{
				$item = (array)$item;

				// media?
				if (isset($item['enclosure']) &&
						((string)$item['enclosure']->attributes()->type == 'image/jpeg' || (string)$item['enclosure']->attributes()->type == 'image/jpg')
				)
				{
					unset($item['image']);
					$item['image']['url'] = (string)$item['enclosure']->attributes()->url;
				}

				unset($item['enclosure']);

				// description
				$item["description"] = (string)$item["description"];

				$this->data['entry'][] = $item;

				if ($i++ >= $this->limit)
					break;
			}

			// the channel
			$channel = (array)$xml->channel;
			if (isset($channel['image']))
				$channel['image'] = array(
					'url' => (string)$channel['image']->url,
					'title' => (string)$channel['image']->title,
					'link' => (string)$channel['image']->link
				);

			unset($channel['item']);

			$this->data['channel'] = $channel;
		}
		else
			$this->error('RSS', 'Read request failed \''.$this->url.'\'');

	}

}

// -----------------------------------------------------------------------------
// r s s - f o r m a t
// -----------------------------------------------------------------------------

/*
	RSS 2.0 		Atom 1.0 				Comments
	----------------------------------------------------------------------------
	rss 			- 						Vestigial in RSS
	channel 		feed
	title 			title
	link 			link 					Atom defines an extensible family of rel values
	description 	subtitle
	language 		- 						Atom uses standard xml:lang attribute
	copyright 		rights
	webMaster 		-
	managingEditor 	author or contributor
	pubDate 		published (in entry) 	Atom has no feed-level equivalent
	lastBuildDate (in channel) 	updated 	RSS has no item-level equivalent
	category 		category
	generator 		generator
	docs 			-
	cloud 			-
	ttl 			- 						<ttl> is problematic, prefer HTTP 1.1 cache control
	image 			logo 					Atom recommends 2:1 aspect ratio
	- 				icon 					As in favicon.ico
	rating 			-
	textInput 		-
	skipHours 		-
	skipDays 		-
	item 			entry
	author 			author
	- 				contributor
	description 	summary and/or content 	depending on whether full content is provided
	comments 		-
	enclosure 		- 						rel="enclosure" on <link> in Atom
	guid 			id
	source 			- 						rel="via" on <link> in Atom
	- 				source 					Container for feed-level metadata to support aggregation
*/


// -----------------------------------------------------------------------------
// call the service
// -----------------------------------------------------------------------------

$service = new rss(array_merge($_GET, $_POST));
echo $service->json();

?>
