<?php
/*
 * This file is a part of Solve framework.
 *
 * @author Alexandr Viniychuk <alexandr.viniychuk@icloud.com>
 * @copyright 2009-2014, Alexandr Viniychuk
 * created: 14.11.14 23:58
 */

namespace Solve\AdminPackage;


use Solve\Kernel\DC;
use Solve\Storage\YamlStorage;

class AdminService {

    static private $_structure;

    public static function getStructure($what = null) {
        if (empty(self::$_structure)) {
            self::$_structure = new YamlStorage(DC::getApplication()->getRoot() . 'structure.yml');
        }
        return $what ? self::$_structure->getDeepValue($what) : self::$_structure;
    }

}