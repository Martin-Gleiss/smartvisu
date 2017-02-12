<?php

require_once '../lib/includes.php';
$baseUrl = "http://" . config_driver_address . ":" . config_driver_port . "/rest/";

if (isset($_GET['cmd'])){
    switch ($_GET['cmd'] ){
        case 'getState':
            echo GetItemState($baseUrl, $_GET['item']);
            break;

        case 'setState':
            SetItemState($baseUrl, $_GET['item'], $_GET['state']);
            echo GetItemState($baseUrl, $_GET['item']);
            break;

        default:
            header("HTTP/1.0 404 Not Found");
            print("404 Not found");
            exit;

    }
}


function GetItemState($baseUrl, $item){
    return GetOpenHabRequest($baseUrl, "items/" . $item . "/state");
}

function SetItemState($baseUrl, $item, $state){
    $url = $baseUrl . "items/" . $item;

    $options = array(
        'http' => array(
            'header'  => "Content-type: text/plain\r\n",
            'method'  => 'POST',
            'content' => $state
        ),
    );

    $context  = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    return $result;
}

function GetOpenHabRequest($baseUrl, $url){
    $url = $baseUrl . $url ;
    $options = array(
        'http' => array(
            'header'  => "Content-type: text/plain\r\n",
            'method'  => 'GET'
        ),
    );

    $context  = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    return $result;
}
