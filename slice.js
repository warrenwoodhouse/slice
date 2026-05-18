/*
 Copyright 2016-present Warren Woodhouse. https://warrenwoodhouse.blogspot.com/codes
 */

(function(window) {

  if (!!window.Slice) {
    return window.Slice;
  }

  var document = window.document;
  // IE8 does not support textContent, so we should fallback to innerText.
  var supportsTextContent = 'textContent' in document.body;

  var Slice = (function() {

    var SliceName = 'displaySlice';
    var SliceId = 'SliceChoiceInfo';
    var divClass = 'Slice-choices-info';
    var innerDivClass = 'Slice-choices-inner';
    var textSpan = 'Slice-choices-text';
    var buttonsClass = 'Slice-choices-buttons';
    var buttonClass = 'Slice-choices-button';
    var singletonClass = 'singleton-element';
    var dismissLinkId = 'SliceChoiceDismiss';

    function _createHeaderElement(SliceText, dismissText, linkText, linkHref) {
      var SliceInnerElement = document.createElement('div');
      SliceInnerElement.className = innerDivClass;
      SliceInnerElement.appendChild(_createConsentText(SliceText));

      var buttonsElement = document.createElement('span');
      buttonsElement.className = buttonsClass;
      SliceInnerElement.appendChild(buttonsElement);

      if (!!linkText && !!linkHref) {
        buttonsElement.appendChild(_createInformationLink(linkText, linkHref));
      }

      buttonsElement.appendChild(_createDismissLink(dismissText));

      var SliceElement = document.createElement('div');
      SliceElement.id = SliceId;
      SliceElement.className = divClass + ' ' + singletonClass;
      SliceElement.appendChild(SliceInnerElement);
      return SliceElement;
    }

    function _createStyleElement() {
      var style = document.createElement('style');
      style.className = singletonClass;
      style.type = 'text/css';
      _setElementText(style,
          '.' + divClass + ' { ' +
              'position:fixed;width:100%;background-color:#666;margin:0;' +
              'left:0;top:0;padding:0;z-index:4000;text-align:center;' +
              'color:#fff;line-height:140%;padding:10px 0;' +
              'font-family:roboto,Arial; } ' +
          '.' + divClass + ' .' + innerDivClass + ' { ' +
              'position:relative;width:initial;margin:0;left:0;top:0; } ' +
          '.' + divClass + ' .' + textSpan + ' { ' +
              'display:inline-block;vertical-align:middle;font-size:16px;' +
              'margin:10px 20px;color:#ccc;max-width:800px;' +
              'text-align:left; }' +
          '.' + divClass + ' .' + buttonsClass + ' { ' +
              'display:inline-block;vertical-align:middle;' +
              'white-space:nowrap;margin:0 10px; } ' +
          '.' + divClass + ' .' + buttonClass + ':hover { ' +
              ' color: #fff; } ' +
          '.' + divClass + ' .' + buttonClass + ' { ' +
              'font-weight:bold;text-transform:UPPERCASE;' +
              'white-space:nowrap;' +
              'color:#eee;margin-left:8px;padding:0 6px; ' +
              'text-decoration:none; }');
      document.getElementsByTagName('head')[0].appendChild(style);
    }

    function _setElementText(element, text) {
      if (supportsTextContent) {
        element.textContent = text;
      } else {
        element.innerText = text;
      }
    }

    function _createConsentText(SliceText) {
      var consentText = document.createElement('span');
      _setElementText(consentText, SliceText);
      consentText.className = textSpan;
      return consentText;
    }

    function _createDismissLink(dismissText) {
      var dismissLink = document.createElement('a');
      _setElementText(dismissLink, dismissText);
      dismissLink.id = dismissLinkId;
      dismissLink.href = '#';
      dismissLink.className = buttonClass;
      return dismissLink;
    }

    function _createInformationLink(linkText, linkHref) {
      var infoLink = document.createElement('a');
      _setElementText(infoLink, linkText);
      infoLink.href = linkHref;
      infoLink.target = '_blank';
      infoLink.className = buttonClass;
      return infoLink;
    }

    function _dismissLinkClick(e) {
      _saveUserPreference();
      _removeSlice();
      e.stopPropagation && e.stopPropagation();
      e.cancelBubble = true;
      return false;
    }

    function _showSlice(SliceText, dismissText, linkText, linkHref) {
      if (_shouldDisplayConsent()) {
        _removeSlice();
        _createStyleElement();
        var consentElement =
            _createHeaderElement(SliceText, dismissText, linkText, linkHref);
        var fragment = document.createDocumentFragment();
        fragment.appendChild(consentElement);
        document.body.appendChild(fragment.cloneNode(true));
        document.getElementById(dismissLinkId).onclick = _dismissLinkClick;
      }
    }

    function _removeSlice() {
      var SliceChoiceElement = document.getElementById(SliceId);
      if (SliceChoiceElement != null) {
        SliceChoiceElement.parentNode.removeChild(SliceChoiceElement);
      }
    }

    function _saveUserPreference() {
      // Set the Slice expiry to one year after today.
      var expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      document.Slice = SliceName + '=y; expires=' + expiryDate.toGMTString();
    }

    function _shouldDisplayConsent() {
      // Display the header only if the Slice has not been set.
      return !document.Slice.match(new RegExp(SliceName + '=([^;]+)'));
    }

    var exports = {};
    exports.showSliceBar = _showSlice;
    return exports;
  })();

  window.Slice = Slice;
  return Slice;
})(this);
