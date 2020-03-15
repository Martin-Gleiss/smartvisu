<?php

class Twig_Extension_AssetExistsExtension extends Twig_Extension
{

    public function getFunctions()
    {
        return array(
                'asset_exists' => new Twig_Function_Method($this, 'asset_exists'),
        );
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
        $toCheck3 = $webRoot . '/pages/' . parse_ini_file($webRoot . '/config.ini')['pages'] . '/widgets/' . $path;
        $pages = explode('pages=', $_SERVER['REQUEST_URI']);
        $toCheck4 = preg_match('/\bpages\b/', $_SERVER['REQUEST_URI']) ? $webRoot . '/pages/' . end($pages) . '/widgets/' . $path : $toCheck3;

        // check if the file exists
        if (!is_file($toCheck1) && !is_file($toCheck2) && !is_file($toCheck3) && !is_file($toCheck4))
        {
            $this->debug_to_console($path . " does not exist. Looked for: " . $toCheck1 . ", " . $toCheck2 . ", " . $toCheck3 . ", " . $toCheck4 . ".");
            return false;
        }

        // check if file is well contained in web/ directory (prevents ../ in paths)
        if (strncmp($webRoot, $toCheck1, strlen($webRoot)) !== 0 && strncmp($webRoot, $toCheck2, strlen($webRoot)) !== 0 && strncmp($webRoot, $toCheck3, strlen($webRoot)) !== 0 && strncmp($webRoot, $toCheck4, strlen($webRoot)) !== 0)
        {
            $this->debug_to_console($path . " does not exist. Looked for: " . $toCheck1 . ", " . $toCheck2 . ", " . $toCheck3 . ", " . $toCheck4 . ".");
            return false;
        }
        return true;
    }

    public function getName()
    {
        return 'asset_exists';
    }

}
