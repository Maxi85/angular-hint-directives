var ddLib = {
  directiveTypes : {
    'html-directives': {
      message: 'There was an HTML error in ',
      directives: {
      'abbr' : 'A',
      'accept': 'A',
      'accesskey': 'A',
      'action': 'A',
      'align': 'A',
      'alt': 'A',
      'background': 'A',
      'bgcolor': 'A',
      'border': 'A',
      'cellpadding': 'A',
      'char': 'A',
      'charoff': 'A',
      'charset': 'A',
      'checked': 'A',
      'cite': 'A',
      'class': 'A',
      'classid': 'A',
      'code': 'A',
      'codebase': 'A',
      'color': 'A',
      'cols': 'A',
      'colspan': 'A',
      'content': 'A',
      'data': 'A',
      'defer': 'A',
      'dir': 'A',
      'face': 'A',
      'for': 'A',
      'frame': 'A',
      'frameborder': 'A',
      'headers': 'A',
      'height': 'A',
      'http-equiv': 'A',
      'href': 'A',
      'id': 'A',
      'label': 'A',
      'lang': 'A',
      'language': 'A',
      'link': 'A',
      'marginheight': 'A',
      'marginwidth': 'A',
      'maxlength': 'A',
      'media': 'A',
      'multiple': 'A',
      'name': 'A',
      'object': 'A',
      'onblur': 'A',
      'onchange': 'A',
      'onclick': 'A',
      'onfocus': 'A',
      'onkeydown': 'A',
      'onkeypress': 'A',
      'onkeyup': 'A',
      'onload': 'A',
      'onmousedown': 'A',
      'onmousemove': 'A',
      'onmouseout': 'A',
      'onmouseover': 'A',
      'onmouseup': 'A',
      'onreset': 'A',
      'onselect': 'A',
      'onsubmit': 'A',
      'readonly': 'A',
      'rel': 'A',
      'rev': 'A',
      'role': 'A',
      'rows': 'A',
      'rowspan': 'A',
      'size': 'A',
      'span': 'EA',
      'src': 'A',
      'start': 'A',
      'style': 'A',
      'text': 'A',
      'target': 'A',
      'title': 'A',
      'type': 'A',
      'value': 'A',
      'width': 'A'}
    },
    'angular-default-directives': {
      message: 'There was an AngularJS error in ',
      directives: {
        'count': 'A',
        'ng-app': 'A',
        'ng-bind': 'A',
        'ng-bindhtml': 'A',
        'ng-bindtemplate': 'A',
        'ng-blur': 'A',
        'ng-change': 'A',
        'ng-checked': 'A',
        'ng-class': 'A',
        'ng-classeven': 'A',
        'ng-classodd': 'A',
        'ng-click': 'A',
        'ng-cloak': 'A',
        'ng-controller': 'A',
        'ng-copy': 'A',
        'ng-csp': 'A',
        'ng-cut': 'A',
        'ng-dblclick': 'A',
        'ng-disabled': 'A',
        'ng-focus': 'A',
        'ng-form': 'A',
        'ng-hide': 'A',
        'ng-href': 'A',
        'ng-if': 'A',
        'ng-include': 'A',
        'ng-init': 'A',
        'ng-keydown': 'A',
        'ng-keypress': 'A',
        'ng-keyup': 'A',
        'ng-list': 'A',
        'ng-model': 'A',
        'ng-modeloptions': 'A',
        'ng-mousedown': 'A',
        'ng-mouseenter': 'A',
        'ng-mouseleave': 'A',
        'ng-mousemove': 'A',
        'ng-mouseover': 'A',
        'ng-mouseup': 'A',
        'ng-nonbindable': 'A',
        'ng-open': 'A',
        'ng-paste': 'A',
        'ng-pluralize': 'A',
        'ng-readonly': 'A',
        'ng-repeat': 'A',
        'ng-selected': 'A',
        'ng-show': 'A',
        'ng-src': 'A',
        'ng-srcset': 'A',
        'ng-style': 'A',
        'ng-submit': 'A',
        'ng-switch': 'A',
        'ng-transclude': 'A',
        'ng-value': 'A',
        'ng-view': 'A',
        'when': 'A'
      }
      },
    'angular-custom-directives': {
      message: 'There was an AngularJS error in ',
      directives: {

      }
    }
  }
}

/**
 *
 *@param scopeElements: [] of HTML elements to be checked for incorrect attributes
 *@param customDirectives: [] of custom directive objects from $compile decorator
 *@param options: {} of options for app to run with:
 *    options.tolerance: Integer, maximum Levenshtein Distance to be allowed for misspellings
 *    options.directiveTypes: [] of which type of directives/attributes to search through
 **/
ddLib.beginSearch = function(scopeElements, customDirectives, options) {
   console.log(scopeElements)
  if(!Array.isArray(scopeElements)) {
    throw new Error("Function beginSearch must be passed an array.");
  }
  options = options || {};
  options.directiveTypes = options.directiveTypes ||
    ['html-directives','angular-default-directives','angular-custom-directives'];;
  options.tolerance = options.tolerance || 4;
  if(customDirectives) {
    ddLib.setCustomDirectives(customDirectives);
  }
  var failedElements = ddLib.findFailedElements(scopeElements, options);
  var messages = ddLib.displayResults(failedElements);
  return failedElements;
};

ddLib.findFailedElements = function(scopeElements, options) {
  return scopeElements.map(ddLib.getFailedAttributesOfElement.bind(null,options))
    .filter(function(x) {return x;});
}

/**
 *@description
 *Adds element tag name (DIV, P, SPAN) to list of attributes with '*' prepended
 *for identification later.
 *
 *@param options: {} options object from beginSearch
 *@param element: HTML element to check attributes of
 *
 *@return {} of html element and [] of failed attributes
 **/
ddLib.getFailedAttributesOfElement = function(options, element) {
  if(element.attributes.length) {
    var elementAttributes = Array.prototype.slice.call(element.attributes);
    elementAttributes.push({nodeName: "*"+element.nodeName.toLowerCase()});
    var failedAttributes = ddLib.getFailedAttributes(elementAttributes, options);
    if(failedAttributes.length) {
      return {
        domElement: element,
        data: failedAttributes
      };
    }
  }
};


/**
 *@param attributes: [] of attributes from element (includes tag name of element, e.g. DIV, P, etc.)
 *@param options: {} options object from beginSearch
 *
 *@return [] of failedAttributes with their respective suggestions and directiveTypes
 **/
ddLib.getFailedAttributes = function(attributes, options) {
  var failedAttributes = [];
  for(var i = 0; i < attributes.length; i++) {
    var attr = ddLib.normalizeAttribute(attributes[i].nodeName);
    var result = ddLib.attributeExsistsInTypes(attr,options);
    if(!result.exsists) {
      var suggestion = ddLib.getSuggestions(attr,options);
      if(suggestion){
        failedAttributes.
          push({match: suggestion.match, error: attr, directiveType:suggestion.directiveType});
      }
    }
    else if(result.wrongUse) {
      failedAttributes.
        push({wrongUse:result.wrongUse, error: attr, directiveType: 'angular-custom-directives'});
    }
  }
  return failedAttributes;
};

/**
 *@param attribute: attribute name as string e.g. 'ng-click', 'width', 'src', etc.
 *@param options: {} options object from beginSearch.
 *
 *@description attribute exsistance in the types of directives/attibutes (html, angular core, and
 * angular custom) and checks the restrict property of values matches its use.
 *
 *@return {} with attribute exsistance and wrong use e.g. restrict property set to elements only.
 **/
ddLib.attributeExsistsInTypes = function(attribute, options) {
  var allTrue = false, wrongUse = '';
  options.directiveTypes.forEach(function(directiveType) {
    isTag = attribute.charAt(0) == '*';
    isCustomDir = directiveType == 'angular-custom-directives';
    if(!isTag) {
      var directive = ddLib.directiveTypes[directiveType].directives[attribute];
      if(directive) {
        if(directive.indexOf('E') > -1 && directive.indexOf('A') < 0) {
          wrongUse = 'element';
        }
        if(directive.indexOf('C') > -1 && directive.indexOf('A') < 0) {
          wrongUse = (wrongUse) ? 'element and class' : 'class';
        }
        allTrue = allTrue || true;
      }
    }
    else if(isTag && isCustomDir){
      var directive = ddLib.directiveTypes[directiveType].directives[attribute.substring(1)];
      if(directive){
        allTrue = allTrue || true;
        if(directive && directive.indexOf('A') > -1 && directive.indexOf('E') < 0) {
          wrongUse = 'attribute';
        }
      }
    }
  });
  return {exsists: allTrue, wrongUse: wrongUse};
};

/**
 *@param attribute: attribute name as string e.g. 'ng-click', 'width', 'src', etc.
 *@param options: {} options object from beginSearch.
 *
 *@return {} with closest match to attribute and the directive type it corresponds to.
 **/
ddLib.getSuggestions = function(attribute, options) {
  var min_levDist = Infinity, match = '', dirType = '';
  options.directiveTypes.forEach(function(directiveType) {
    isTag = attribute.charAt(0) == '*';
    isCustomDir = directiveType == 'angular-custom-directives';
    if(!isTag || (isTag && isCustomDir)) {
      directiveTypeData = ddLib.directiveTypes[directiveType].directives
      var tempMatch = ddLib.findClosestMatchIn(directiveTypeData, attribute);
      if(tempMatch.min_levDist < options.tolerance && tempMatch.min_levDist < min_levDist) {
        match = tempMatch.match;
        dirType = directiveType;
      }
    }
  });
  return (match)? {match:match, directiveType:dirType}: null;
};

/**
 *@param directiveTypeData: {} with list of directives/attributes and
 *their respective restrict properties.
 *@param attribute: attribute name as string e.g. 'ng-click', 'width', 'src', etc.
 *
 *@return {} with Levenshtein Distance and name of the closest match to given attribute.
 **/
ddLib.findClosestMatchIn = function(directiveTypeData, attribute) {
  if(typeof attribute != 'string') {
    throw new Error('Function must be passed a string as second parameter.');
  }
  if((directiveTypeData === null || directiveTypeData === undefined) ||
    typeof directiveTypeData != 'object') {
    throw new Error('Function must be passed a defined object as first parameter.');
  }
  var min_levDist = Infinity, closestMatch = '';
  for(var directive in directiveTypeData){
    if(Math.abs(attribute.length-directive.length) < 3) {
      var currentlevDist = ddLib.levenshteinDistance(attribute, directive);
      var closestMatch = (currentlevDist < min_levDist)? directive : closestMatch;
      var min_levDist = (currentlevDist < min_levDist)? currentlevDist : min_levDist;
    }
  }
  return {min_levDist: min_levDist, match: closestMatch};
};

/**
 *@param attribute: attribute name before normalization as string
 * e.g. 'data-ng-click', 'width', 'x:ng:src', etc.
 *
 *@return normalized attribute name
 **/
ddLib.normalizeAttribute = function(attribute) {
  return attribute.replace(/^(?:data|x)[-_:]/,"").replace(/[:_]/g,'-');
};

/**
 *@param failedElements: [] of {}s of all failed elements with their failed attributes and closest
 *matches or restrict properties
 *
 *@return [] of failed messages.
 **/
ddLib.displayResults = function(failedElements) {
  var messages = [];
  failedElements.forEach(function(obj) {
    obj.data.forEach(function(attr) {
      id = (obj.domElement.id) ? ' with id: #'+obj.domElement.id : '';
      type = obj.domElement.nodeName;
      message = ddLib.directiveTypes[attr.directiveType].message+type+' element'+id+'. ';
      var error = (attr.error.charAt(0) == '*') ? attr.error.substring(1): attr.error;
      if(!attr.wrongUse) {
        message +='Found incorrect attribute "'+error+'" try "'+attr.match+'".';
      }
      else {
        var aecmType = (attr.wrongUse.indexOf('attribute') > -1)? 'Element' : 'Attribute';
        message += aecmType+' name "'+error+'" is reserved for '+attr.wrongUse+' names only.';
      }
      console.warn(message);
      console.log(obj.domElement)
      messages.push(message)
    })
  })
  return messages;
};

/**
 *@param customDirectives: [] of custom directive objects from $compile decorator
 **/
ddLib.setCustomDirectives = function(customDirectives) {
  customDirectives.forEach(function(directive) {
    var directiveName = directive.directiveName.replace(/([A-Z])/g, '-$1').toLowerCase();
    ddLib.directiveTypes['angular-custom-directives']
      .directives[directiveName] = directive.restrict;
  })
}

/**
 *@param s: first string to compare for Levenshtein Distance.
 *@param t: second string to compare for Levenshtein Distance.
 *
 *@description
 *Calculates the minimum number of changes (insertion, deletion, transposition) to get from s to t.
 **/
ddLib.levenshteinDistance = function(s, t) {
    if(typeof s !== 'string' || typeof t !== 'string') {
      throw new Error('Function must be passed two strings, given: '+typeof s+' and '+typeof t+'.');
    }
    var d = [];
    var n = s.length;
    var m = t.length;

    if (n == 0) return m;
    if (m == 0) return n;

    for (var i = n; i >= 0; i--) d[i] = [];
    for (var i = n; i >= 0; i--) d[i][0] = i;
    for (var j = m; j >= 0; j--) d[0][j] = j;
    for (var i = 1; i <= n; i++) {
        var s_i = s.charAt(i - 1);

        for (var j = 1; j <= m; j++) {
            if (i == j && d[i][j] > 4) return n;
            var t_j = t.charAt(j - 1);
            var cost = (s_i == t_j) ? 0 : 1;
            var mi = d[i - 1][j] + 1;
            var b = d[i][j - 1] + 1;
            var c = d[i - 1][j - 1] + cost;
            if (b < mi) mi = b;
            if (c < mi) mi = c;
            d[i][j] = mi;
            if (i > 1 && j > 1 && s_i == t.charAt(j - 2) && s.charAt(i - 2) == t_j) {
                d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
            }
        }
    }
    return d[n][m];
};