(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
$("#sidebar").append('<li class="nav-item" id="btnSidebarIndex">\
          <a class="nav-link" href="/index">\
            <i class="fas fa-home"></i>\
            <span>Página Inicial</span>\
          </a>\
        </li>\
        <li class="nav-item" id="btnSidebarUsuario">\
          <a class="nav-link" href="/usuarios">\
            <i class="fas fa-user"></i>\
            <span>Gerenciamento de Usuário</span>\
          </a>\
        </li>\
        <li class="nav-item dropdown" id="btnSidebarSetor">\
          <a class="nav-link" href="/setores">\
            <i class="fas fa-users"></i>\
            <span>Gerenciamento de Setores</span>\
          </a>\
        </li>\
        <li class="nav-item" id="btnSidebarItem">\
          <a class="nav-link" href="/itens">\
            <i class="fas fa-box"></i>\
            <span>Gerenciamento de Itens</span></a>\
        </li>\
        <li class="nav-item" id="btnSidebarComputador">\
          <a class="nav-link" href="/computadores">\
            <i class="fas fa-desktop"></i>\
            <span>Gerenciamento de Computadores</span></a>\
        </li>');
},{}]},{},[1]);
