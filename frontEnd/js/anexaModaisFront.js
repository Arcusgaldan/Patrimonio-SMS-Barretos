(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
$("body").append('<div class="modal fade" id="logoutModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">\
      <div class="modal-dialog" role="document">\
        <div class="modal-content">\
          <div class="modal-header">\
            <h5 class="modal-title" id="exampleModalLabel">Logout</h5>\
            <button class="close" type="button" data-dismiss="modal" aria-label="Close">\
              <span aria-hidden="true">×</span>\
            </button>\
          </div>\
          <div class="modal-body">Clique em "Logout" para encerrar sua sessão.</div>\
          <div class="modal-footer">\
            <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancelar</button>\
            <a class="btn btn-primary" id="btnLogout">Logout</a>\
          </div>\
        </div>\
      </div>\
    </div>');

$("body").append('<div class="modal fade" id="sucessoModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">\
  <div class="modal-dialog" role="document">\
    <div class="modal-content">\
      <div class="modal-header">\
        <h5 class="modal-title" id="">Sucesso</h5>\
        <button class="close" type="button" data-dismiss="modal" aria-label="Close">\
          <span aria-hidden="true">×</span>\
        </button>\
      </div>\
      <div class="modal-body"><p id="msgSucessoModal" style="color: #000">Sua operação foi realizada com sucesso!</p></div>\
      <div class="modal-footer">\
        <button class="btn btn-primary" type="button" data-dismiss="modal">OK</button>\
      </div>\
    </div>\
  </div>\
</div>');

$("body").append('<div class="modal fade" id="erroModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">\
  <div class="modal-dialog" role="document">\
    <div class="modal-content">\
      <div class="modal-header">\
        <h5 class="modal-title" id="">Erro</h5>\
        <button class="close" type="button" data-dismiss="modal" aria-label="Close">\
          <span aria-hidden="true">×</span>\
        </button>\
      </div>\
      <div class="modal-body"><p id="msgErroModal" style="color: #000">Erro ao realizar a operação!</p></div>\
      <div class="modal-footer">\
        <button class="btn btn-secundary" type="button" data-dismiss="modal">OK</button>\
      </div>\
    </div>\
  </div>\
</div>');
},{}]},{},[1]);
