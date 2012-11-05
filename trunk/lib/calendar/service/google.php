<?
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012
 * @license     GPL <http://www.gnu.de>
 * ----------------------------------------------------------------------------- 
 */


require_once '../../../config.php';
require_once const_path_system.'calendar/calendar.php';
    

/** 
 * This class reads the phonelist of an auerswald phonesystem
 */   
class calendar_google extends calendar
{
    /** 
    * Check if the cache-file exists
    */      
    public function run()
    {
        $url = 'http://www.google.com/calendar/feeds/gleiss.martin%40googlemail.com/private-af446a68a2aa4fc7540238e3870b785c/basic';
        $url = str_replace("/basic", "/full?singleevents=true&futureevents=true&orderby=starttime&sortorder=a", $url);
        $context = stream_context_create(array('http'=>array('method'=>"GET")));
        $content = file_get_contents($url, false, $context);
        $this->debug($content);
        
        $xml = simplexml_load_string($content);
        
        $i = 1;
        foreach ($xml->entry as $entry)
        {
            $meta = $entry->children('http://schemas.google.com/g/2005');
            
            $startstamp = strtotime($meta->when->attributes()->startTime) + date("Z", strtotime($meta->when->attributes()->startTime));
            $endstamp = strtotime($meta->when->attributes()->endTime) + date("Z", strtotime($meta->when->attributes()->endTime));
            
            $this->data[] = array('pos' => $i++, 
                'start' => date('d.m.y', $startstamp).' '.gmdate('H:i', $startstamp),
                'end' => date('d.m.y', $endstamp).' '.gmdate('H:i', $endstamp),
                'title' => (string)($entry->title),
                'where' => (string)$meta->where->attributes()->valueString,
                
                );
        }
    }
}


// -----------------------------------------------------------------------------
// call the service
// -----------------------------------------------------------------------------

$service = new calendar_google(array_merge($_GET, $_POST));
echo $service->json();

?>