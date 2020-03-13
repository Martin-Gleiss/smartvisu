<?php

class Twig_Extension_AssetExistsExtension extends Twig_Extension
{

    public function getFunctions()
    {
        return array(
                'asset_exists' => new Twig_Function_Method($this, 'asset_exists'),
        );
    }

    public function asset_exists($path)
    {
        $webRoot = realpath(dirname(dirname(dirname(__DIR__))));
        $path = end(explode('widgets/', $path));
        $toCheck1 = $webRoot . '/widgets/' . $path;
        $toCheck2 = $webRoot . '/dropins/widgets/' . $path;
        $toCheck3 = $webRoot . '/pages/' . parse_ini_file($webRoot . '/config.ini')['pages'] . '/widgets/' . $path;
        $toCheck4 = $webRoot . '/pages/' . end(explode('pages=', $_SERVER['REQUEST_URI'])) . '/widgets/' . $path;

        // check if the file exists
        if (!is_file($toCheck1) && !is_file($toCheck2) && !is_file($toCheck3) && !is_file($toCheck4))
        {
            return false;
        }

        // check if file is well contained in web/ directory (prevents ../ in paths)
        if (strncmp($webRoot, $toCheck1, strlen($webRoot)) !== 0 && strncmp($webRoot, $toCheck2, strlen($webRoot)) !== 0 && strncmp($webRoot, $toCheck3, strlen($webRoot)) !== 0 && strncmp($webRoot, $toCheck4, strlen($webRoot)) !== 0)
        {
            return false;
        }
        return true;
    }

    public function getName()
    {
        return 'asset_exists';
    }

}
