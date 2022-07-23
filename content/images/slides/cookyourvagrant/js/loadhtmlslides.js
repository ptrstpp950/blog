/*global $:false */
/*global console:false */
// Modified from markdown.js from Hakim to handle external html files
(function () {
    /*jslint loopfunc: true, browser: true*/
    /*globals alert*/
    'use strict';

    String.prototype.format = String.prototype.f = function() {
        var s = this,
            i = arguments.length;

        while (i--) {
            s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
        }
        return s;
    };

    var templateGithub = '&nbsp;<br/><span class="github-btn github-watchers github-btn-large"><a class="gh-btn active" href="https://github.com/ptrstpp950/{0}/commit/{1}" target="_blank"><span class="gh-ico"></span> <span class="gh-text" id="gh-text">{1}</span></a></span>';

    var querySlidingHtml = function () {
        var sections = document.querySelectorAll('[data-html]'),
            section, j, jlen;

        for (j = 0, jlen = sections.length; j < jlen; j++) {
            section = sections[j];

            if (section.getAttribute('data-html').length) {

                var xhr = new XMLHttpRequest(),
                    url = section.getAttribute('data-html'),
                    cb = function () {
                        if (xhr.readyState === 4) {
                            if (
                                (xhr.status >= 200 && xhr.status < 300) ||
                                xhr.status === 0 // file protocol yields status code 0 (useful for local debug, mobile applications etc.)
                                ) {
                                section.innerHTML = xhr.responseText;
                                if($(section).find('.commit').length>0){
                                    $(section).find('.commit').each(function() {
                                        var commit = $(this).attr('data-commit');
                                        var repo = $(this).attr('data-repo');
                                        this.innerHTML = templateGithub.format(repo,commit);
                                        console.log(templateGithub.format(repo,commit));

                                    });
                                }
                                
                            } else {
                                section.outerHTML = '<section data-state="alert">ERROR: The attempt to fetch ' + url + ' failed with the HTTP status ' + xhr.status + '. Check your browser\'s JavaScript console for more details.</p></section>';
                            }
                        }
                    };

                xhr.onreadystatechange = cb;

                xhr.open('GET', url, false);
                try {
                    xhr.send();
                } catch (e) {
                    alert('Failed to get file' + url + '.' + e);
                }
            }
        }
    };

    querySlidingHtml();
})();
