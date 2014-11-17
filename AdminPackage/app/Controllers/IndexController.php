<?php
/*
 * This file is a part of Helper project.
 *
 * created: 2014-11-09 21:02:32
 */

namespace Admin\Controllers;


use Solve\Controller\ApiController;
use Solve\Security\SecurityService;
use Solve\Session\RemoteSessionManager;

class IndexController extends ApiController {

    protected $_unprotectedMethods = array('login', 'init');

    public function defaultAction() {
        $this->view->setStandaloneTemplate('_layout');
    }


    public function loginAction() {
        if ($this->request->isXHR()) {
            $securityService = SecurityService::getInstance('default');

            if ($securityService->checkCredentials($this->request->getVar('data'))) {
                $this->setData($securityService->getUser(), 'user');
            } else {
                $this->returnErrorStatus('Invalid credentials');
            }
        }
    }

    public function logoutAction() {
        SecurityService::getInstance()->unAuthorize();
        $this->setData('ok');
    }

    public function initAction() {
        $initData = array(
            'session-token' => RemoteSessionManager::getSessionToken()
        );
        $securityService = SecurityService::getInstance();
        if ($securityService->isAuthorized()) {
            $initData['isLoggedIn'] = true;
            $initData['user'] = $securityService->getUser();
            unset($initData['user']['password']);
        } else {
            $initData['isLoggedIn'] = false;
        }
        $this->setData($initData);
    }

}