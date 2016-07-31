<?php
/**
 * Created by PhpStorm.
 * User: bauhaus
 * Date: 29.07.2016
 * Time: 14:18
 */

$baseUrl = "http://localhost:8080/rest/";

if (isset($_GET['cmd'])){
    switch ($_GET['cmd'] ){
        case 'getitems':
            echo GetItems($baseUrl);
            break;

        case 'getState':
            echo GetItemState($baseUrl, $_GET['item']);
            break;

        case 'setState':
            SetItemState($baseUrl, $_GET['item'], $_GET['state']);
            echo GetItemState($baseUrl, $_GET['item']);
            break;

        case 'pollchanges':
            echo PollChanges($baseUrl);
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

function GetItems($baseUrl){

}



function PollChanges($baseUrl){

    $address="localhost";
    $service_port="8080";

    /* Erzeuge ein TCP/IP Socket. */
    $socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
    if ($socket === false) {
        echo "socket_create() schlug fehl: Grund: " . socket_strerror(socket_last_error()) . "\n";
    } else {
        echo "OK.\n";
    }

    echo "Versuche Verbing zu '$address' auf Port '$service_port' aufzubauen...";
    $result = socket_connect($socket, $address, $service_port);
    if ($result === false) {
        echo "socket_connect() schulg fehl.\nGrund: ($result) " . socket_strerror(socket_last_error($socket)) . "\n";
    } else {
        echo "OK.\n";
    }


    $in = "GET /rest/items HTTP/1.1\r\n";
    $in .= "Host: localhost\r\n";
    $in .= "Content-type: text/plain\r\nX-Atmosphere-Transport: long-polling\r\nX-Atmosphere-tracking-id: 123\r\nX-Atmosphere-Framework: 1.0\r\n";
    $in .= "\r\n\r\n";

    $out = '';

    echo "Sende HTTP HEAD Request...";
    socket_write($socket, $in, strlen($in));
    echo "OK.\n";

    echo "Lese Response:\n\n";


    while (true){
        $bytes = socket_recv($socket, $buf, 2048,  0) ;
        echo $buf;

        if ($bytes <= 0) {
            return;
        }
        if ($buf == NULL) {
            return;
        }
    }


    return;
    $url = $baseUrl . "items";
    $options = array(
        'http' => array(
            'header'  => "Content-type: text/plain\r\nX-Atmosphere-Transport: long-polling\r\nX-Atmosphere-tracking-id: 123\r\nX-Atmosphere-Framework: 1.0\r\n",
            'method'  => 'GET',
            'connection'  => 'close'
        ),
    );

    echo $url;


    $context  = stream_context_create($options);
    $result = file_get_contents($url, false, $context);

    echo "ended";
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