<?php
/*
 * This file is a part of Solve framework.
 *
 * @author Alexandr Viniychuk <alexandr.viniychuk@icloud.com>
 * @copyright 2009-2014, Alexandr Viniychuk
 * created: 10.11.14 09:08
 */

namespace Admin\Controllers;


use Solve\AdminPackage\AdminService;
use Solve\Controller\BaseController;
use Solve\EventDispatcher\BaseEvent;
use Solve\Http\HttpStatus;
use Solve\Http\Response;
use Solve\Kernel\DC;
use Solve\Security\SecurityService;
use Solve\Utils\Inflector;
use Solve\View\RenderEngine\SlotRenderEngine;

class ApplicationController extends BaseController {

    public function _preAction() {
        if (!$this->request->isXHR() && !in_array($this->route->getName(), array('init', 'index', 'login', 'logout', 'tmpFile'))
        ) {
//            $this->redirectToUri('/');
        }
        $moduleName = Inflector::underscore(substr($this->route->getControllerName(), 0, -10));
        if (AdminService::getStructure()->has($moduleName)) {
            $moduleConfig = AdminService::getStructure($moduleName);
            $this->route->setControllerName($moduleConfig['type'].'Controller');
            $this->request->setVar('moduleName', $moduleName);
        }
    }

    public static function onRouteNotFound(BaseEvent $event) {
        if (!DC::getRouter()->getCurrentRequest()->isXHR()) {
            DC::getRouter()->redirectToRelativeUri('admin/');
        } else {
            $response = new Response();
            $response->setStatusCode(HttpStatus::HTTP_NOT_FOUND);
            $response->send();
        }
    }

    public static function onUnauthenticated(BaseEvent $event) {
        DC::getRouter()->redirectToRelativeUri('admin/');
    }

}