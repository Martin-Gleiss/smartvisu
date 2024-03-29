<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012 - 2015
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */


require_once const_path_system.'service.php';


/**
 * This class is the base class of all phone systems
 */
class phone extends service
{
	
	public function __construct($request)
	{
		if(!function_exists('mb_get_info') && !($this instanceof phone_offline))
			$this->error('Phone service', 'Phone services require PHP mbstring extension.');

		parent::__construct($request);
	}

	/**
	 * initialization of some parameters
	 */
	public function init($request)
	{
		parent::init($request);

		$this->server = config_phone_server;
		$this->port = config_phone_port;
		$this->user = config_phone_user;
		$this->pass = config_phone_pass;
	}

	/**
	 * prepare the data
	 */
	public function prepare()
	{
		foreach ($this->data as $id => $ds)
		{
			if ($ds['number'] != '' or $ds['name'] != '')
			{
				// date
				$ds['date'] = transdate('short', strtotime($ds['date']));
				$ds['text'] = $ds['name'];

				// no name? caller unknown
				if ($ds['name'] == '')
					$ds['text'] = trans('phone', 'unknown');

				// combine the infos, if type is present
				if (isset($ds['type']) && $ds['type'] != '')
					$ds['text'] = $ds['name'].' ('.$ds['type'].')';

				// dir == 0 missed
				$ds['dirpic'] = 'dir.png';
				$ds['diralt'] = trans('phone', 'missed');
				
				// dir > 0 incoming 
				if ($ds['dir'] > 0)
				{
					$ds['dirpic'] = 'dir_incoming.png';
					$ds['diralt'] = trans('phone', 'incoming');
				}
				
				//dir = 10 rejected
				if($ds['dir'] == 10)
				{
					$ds['dirpic'] = 'dir_rejected.png';
					$ds['diralt'] = trans('phone', 'rejected');	
				}

				// dir < 0 outgoing
				if ($ds['dir'] < 0)
				{
					$ds['dirpic'] = 'dir_outgoing.png';
					$ds['diralt'] = trans('phone', 'outgoing');
					if ($ds['called'] !='')
						$ds['number'] = $ds['called'];
				}
				// is there a picture to the caller?
				if ($ds['number'] != '' and is_file(const_path.'pics/phone/'.$ds['number'].'.jpg'))
					$ds['pic'] = $ds['number'].'.jpg';
				elseif ($ds['number'] != '' and is_file(const_path.'pics/phone/'.$ds['number'].'.png'))
					$ds['pic'] = $ds['number'].'.png';
				elseif ($ds['name'] != '' and is_file(const_path.'pics/phone/'.$ds['name'].'.jpg'))
					$ds['pic'] = $ds['name'].'.jpg';
				elseif ($ds['name'] != '' and is_file(const_path.'pics/phone/'.$ds['name'].'.png'))
					$ds['pic'] = $ds['name'].'.png';
				else
					$ds['pic'] = '0.jpg';

				$ret[] = $ds;
			}
		}
		$this->data = $ret;
	}

}

?>
