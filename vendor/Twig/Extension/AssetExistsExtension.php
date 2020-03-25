<?php

class Twig_Extension_AssetExistsExtension extends Twig_Extension
{

    public function getFunctions()
    {
        return array(
                'asset_exists' => new Twig_Function_Method($this, 'asset_exists'),
        );
    }

    function get_string_between($string, $start, $end){
        $string = ' ' . $string . $end;
        $ini = strpos($string, $start);
        if ($ini == 0) return '';
        $ini += strlen($start);
        $len = strpos($string, $end, $ini) - $ini;
        return substr($string, $ini, $len);
    }

    function debug_to_console($data) {
        // Buffering to solve problems frameworks, like header() in this and not a solid return.
        ob_start();

        $data = 'PHP: ' . $data;
        $output = 'console.log(' . json_encode($data) . ');';
        $output = sprintf('<script>%s</script>', $output);

        echo $output;
    }

    public function asset_exists($path)
    {
        $webRoot = realpath(dirname(dirname(dirname(__DIR__))));
        $widgetpath = explode('widgets/', $path);
        $path = end($widgetpath);
        $toCheck1 = $webRoot . '/widgets/' . $path;
        $toCheck2 = $webRoot . '/dropins/widgets/' . $path;
        set_error_handler(function($errno, $errstr, $errfile, $errline, $errcontext) {
            // error was suppressed with the @-operator
            if (0 === error_reporting()) {
                return false;
            }

            throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
        });
        $pages = $this->get_string_between($_SERVER['REQUEST_URI'], 'pages=', '&');
        $toCheck4 = preg_match('/\bpages\b/', $_SERVER['REQUEST_URI']) ? $webRoot . '/pages/' . $pages . '/widgets/' . $path : NULL;
        $lastcheck = is_null($toCheck4) ? "." : ", " . $toCheck4 . ".";
        try {
          if (is_null($toCheck4))
            $toCheck3 = $webRoot . '/pages/' . parse_ini_file($webRoot . '/config.ini')['pages'] . '/widgets/' . $path;
          else
            $toCheck3 = NULL;
        }
        catch (Exception $e) {
          $toCheck3 = NULL;
        }
        restore_error_handler();


        // check if the file exists
        if (!is_file($toCheck1) && !is_file($toCheck2) && !is_file($toCheck3) && !is_file($toCheck4))
        {
            $this->debug_to_console($path . " does not exist. Looked for: " . $toCheck1 . ", " . $toCheck2 . ", " . $toCheck3 . $lastcheck);
            return false;
        }

        // check if file is well contained in web/ directory (prevents ../ in paths)
        if (strncmp($webRoot, $toCheck1, strlen($webRoot)) !== 0 && strncmp($webRoot, $toCheck2, strlen($webRoot)) !== 0 && strncmp($webRoot, $toCheck3, strlen($webRoot)) !== 0 && strncmp($webRoot, $toCheck4, strlen($webRoot)) !== 0)
        {
            $this->debug_to_console($path . " does not exist. Looked for: " . $toCheck1 . ", " . $toCheck2 . ", " . $toCheck3 . $lastcheck);
            return false;
        }
        return true;
    }

    public function getName()
    {
        return 'asset_exists';
    }

}
