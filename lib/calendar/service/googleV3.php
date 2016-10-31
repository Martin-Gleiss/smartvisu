<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß (basic version), Carsten Gotschlich (google API V3), Thorsten Moll (cache, multiple calendars)
 * @copyright   2012
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */

// Note: for debugging purposes you can execute this script from commandline with    php -q <scriptname>

require_once '../../../lib/includes.php';
require_once const_path_system.'calendar/calendar.php';
require_once const_path_system.'class_cache.php';

/**
 * This class reads a google calenda
 */
class calendar_google extends calendar
{
    const CLIENT_ID     = 'XXX';  // put your clientID here - from Google website
    const CLIENT_SECRET = 'YYY';  // put your client Secret here - from Google WebSite
    const REFRESH_TOKEN = 'ZZZ';  // Put your google refresh token here - from other PHP script

    var $calendar_ids = array();

    /**
     * initialization of some parameters
     */
    public function init($request)
    {
        parent::init($request);
        if ($this->url == '')
            $this->url = 'primary';
        if ($this->count == 0)
            $this->count = 10;

        $this->calendar_ids = explode(',' , $this->url);
    }


    public function run()
    {
        $cache = new class_cache('calendar_google.json');

        // check for cached data
        if ($cache->hit(3600)) {
            $cache_content = json_decode($cache->read(), true);

            if ($cache_content['accessTokenExpiry'] < time()) {
                // if token is not valid anymore reload everything cached
                unset($cache_content);
            }
        }

        if (!isset($cache_content['accessToken'])) {
            $token_url = 'https://accounts.google.com/o/oauth2/token';
            $post_data = array(
                            'client_secret' =>   self::CLIENT_SECRET,
                            'grant_type'    =>   'refresh_token',
                            'refresh_token' =>   self::REFRESH_TOKEN,
                            'client_id'     =>   self::CLIENT_ID
                            );
            $ch = curl_init();

            curl_setopt($ch, CURLOPT_URL, $token_url);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

            $result = curl_exec($ch);
            $token_object = json_decode($result);

            $cache_content['accessToken'] = $token_object->{'access_token'};
            $cache_content['accessTokenExpiry'] = time() + $token_object->{'expires_in'} - 60;
        }

        //---------------------------------------------------------------------
        // so now we have an access-token, let's use it to access the calendar
        $context = stream_context_create(array('http' => array('method' => "GET", 'header' => "Authorization: OAuth " . $cache_content['accessToken'])));
        
        // first let's retrieve the colors and cache them
        if (!isset($cache_content['calendarColors'])) {
            $resturl = 'https://www.googleapis.com/calendar/v3/colors';
            $content = @file_get_contents($resturl, false, $context);
            if ($content !== false)
            {
                $result = json_decode($content,true);
                $cache_content['calendarColors'] = $result["event"];
                //var_dump($cache_content['calendarColors']);
            }
        }

        // then retrieve the users calendars available and cache them, too
        // do only if more than one calendar specified
        if (count($this->calendar_ids) > 1 && !isset($cache_content['calendarList'])) {
            $resturl = 'https://www.googleapis.com/calendar/v3/users/me/calendarList';
            $content = @file_get_contents($resturl, false, $context);
            if ($content !== false) {
                $result = json_decode($content);
                $calendarList = array();

                foreach ($result->{'items'} as $entry) {
                    $cal = array();
                    $cal["description"]     = $entry->{'summary'};
                    $cal["backgroundColor"] = $entry->{'backgroundColor'};
                    $calendarList[$entry->{'id'}] = $cal;
                }

                $cache_content['calendarList'] = $calendarList;
                //var_dump($cache_content['calendarList']);
            }
        }
        
        // retrieve the calendar entries from each calendar
        $events = array();

        foreach ($this->calendar_ids as $calendarid) {
            $resturl = 'https://www.googleapis.com/calendar/v3/calendars/'. urlencode($calendarid) . '/events?maxResults='. $this->count .'&q=-%22%40visu+no%22&singleEvents=true&orderBy=startTime&timeMin='.urlencode(date('c'));
            $content = @file_get_contents($resturl, false, $context);
            $this->debug($content);

            // for debugging purposes only
            // echo $content;
            // echo "###########";

            if ($content !== false)
            {
                $result = json_decode($content,true);

                foreach ($result["items"] as $entry)
                {
                    $startstamp = (string)($entry["start"]["dateTime"]);
                    $endstamp = (string)($entry["end"]["dateTime"]);
                    if ($startstamp == '')
                        $startstamp = (string)($entry["start"]["date"]);
                    if ($endstamp == '')
                        $endstamp = (string)($entry["end"]["date"]);
                    $start = strtotime($startstamp);
                    $end   = strtotime($endstamp);

                    $color = '';
                    if (((string)($entry["colorId"]))!='') {
                        $color=$cache_content['calendarColors'][(string)($entry["colorId"])]['background'];
                    }
                    else if (count($this->calendar_ids) > 1) {
                        $color=$cache_content['calendarList'][$calendarid]['backgroundColor'];
                    }

                    $events[$start] = array(
                        'start' => date('y-m-d', $start).' '.date('H:i:s', $start),
                        'end' => date('y-m-d', $end).' '.date('H:i:s', $end),
                        'title' => (string)($entry["summary"]),
                        'content' => (string)($entry["description"]),
                        'where' => (string)($entry["location"]),
                        'color' => $color,
                        'link' => (string)($entry["htmlLink"])
                    );
                }
            }
            else
            {
                $this->error('Calendar: Google', 'Calendar '. $calendarid .' read request failed!');
            }
        }

        // finally re-order the events comming potentially from different calendars
        $i = 1;
        ksort($events);
        foreach($events as $event) {
            $event['pos'] = $i++;
            $this->data[] = $event;
            if ($i > $this->count) break;
        }

        // at the end write back cache
        $cache->write( json_encode($cache_content) );
    }
}


// -----------------------------------------------------------------------------
// call the service
// ----------------------------------------------------------------------------

//

$service = new calendar_google(array_merge($_GET, $_POST));
echo $service->json();
?> 
