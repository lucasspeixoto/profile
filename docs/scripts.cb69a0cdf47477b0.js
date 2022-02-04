var _self =
		'undefined' != typeof window
			? window
			: 'undefined' != typeof WorkerGlobalScope &&
			  self instanceof WorkerGlobalScope
			? self
			: {},
	Prism = (function () {
		var p = /\blang(?:uage)?-(\w+)\b/i,
			v = 0,
			a = (_self.Prism = {
				manual: _self.Prism && _self.Prism.manual,
				disableWorkerMessageHandler:
					_self.Prism && _self.Prism.disableWorkerMessageHandler,
				util: {
					encode: function (e) {
						return e instanceof d
							? new d(e.type, a.util.encode(e.content), e.alias)
							: 'Array' === a.util.type(e)
							? e.map(a.util.encode)
							: e
									.replace(/&/g, '&amp;')
									.replace(/</g, '&lt;')
									.replace(/\u00a0/g, ' ');
					},
					type: function (e) {
						return Object.prototype.toString
							.call(e)
							.match(/\[object (\w+)\]/)[1];
					},
					objId: function (e) {
						return (
							e.__id || Object.defineProperty(e, '__id', { value: ++v }), e.__id
						);
					},
					clone: function (e) {
						switch (a.util.type(e)) {
							case 'Object':
								var n = {};
								for (var t in e)
									e.hasOwnProperty(t) && (n[t] = a.util.clone(e[t]));
								return n;
							case 'Array':
								return e.map(function (i) {
									return a.util.clone(i);
								});
						}
						return e;
					},
				},
				languages: {
					extend: function (e, r) {
						var n = a.util.clone(a.languages[e]);
						for (var t in r) n[t] = r[t];
						return n;
					},
					insertBefore: function (e, r, n, t) {
						var i = (t = t || a.languages)[e];
						if (2 == arguments.length) {
							for (var l in (n = arguments[1]))
								n.hasOwnProperty(l) && (i[l] = n[l]);
							return i;
						}
						var o = {};
						for (var s in i)
							if (i.hasOwnProperty(s)) {
								if (s == r)
									for (var l in n) n.hasOwnProperty(l) && (o[l] = n[l]);
								o[s] = i[s];
							}
						return (
							a.languages.DFS(a.languages, function (c, h) {
								h === t[e] && c != e && (this[c] = o);
							}),
							(t[e] = o)
						);
					},
					DFS: function (e, r, n, t) {
						for (var i in ((t = t || {}), e))
							e.hasOwnProperty(i) &&
								(r.call(e, i, e[i], n || i),
								'Object' !== a.util.type(e[i]) || t[a.util.objId(e[i])]
									? 'Array' === a.util.type(e[i]) &&
									  !t[a.util.objId(e[i])] &&
									  ((t[a.util.objId(e[i])] = !0),
									  a.languages.DFS(e[i], r, i, t))
									: ((t[a.util.objId(e[i])] = !0),
									  a.languages.DFS(e[i], r, null, t)));
					},
				},
				plugins: {},
				highlightAll: function (e, r) {
					a.highlightAllUnder(document, e, r);
				},
				highlightAllUnder: function (e, r, n) {
					var t = {
						callback: n,
						selector:
							'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code',
					};
					a.hooks.run('before-highlightall', t);
					for (
						var o, i = t.elements || e.querySelectorAll(t.selector), l = 0;
						(o = i[l++]);

					)
						a.highlightElement(o, !0 === r, t.callback);
				},
				highlightElement: function (e, r, n) {
					for (var t, i, l = e; l && !p.test(l.className); ) l = l.parentNode;
					l &&
						((t = (l.className.match(p) || [, ''])[1].toLowerCase()),
						(i = a.languages[t])),
						(e.className =
							e.className.replace(p, '').replace(/\s+/g, ' ') +
							' language-' +
							t),
						e.parentNode &&
							/pre/i.test((l = e.parentNode).nodeName) &&
							(l.className =
								l.className.replace(p, '').replace(/\s+/g, ' ') +
								' language-' +
								t);
					var s = { element: e, language: t, grammar: i, code: e.textContent };
					if ((a.hooks.run('before-sanity-check', s), !s.code || !s.grammar))
						return (
							s.code &&
								(a.hooks.run('before-highlight', s),
								(s.element.textContent = s.code),
								a.hooks.run('after-highlight', s)),
							void a.hooks.run('complete', s)
						);
					if ((a.hooks.run('before-highlight', s), r && _self.Worker)) {
						var c = new Worker(a.filename);
						(c.onmessage = function (h) {
							(s.highlightedCode = h.data),
								a.hooks.run('before-insert', s),
								(s.element.innerHTML = s.highlightedCode),
								n && n.call(s.element),
								a.hooks.run('after-highlight', s),
								a.hooks.run('complete', s);
						}),
							c.postMessage(
								JSON.stringify({
									language: s.language,
									code: s.code,
									immediateClose: !0,
								}),
							);
					} else
						(s.highlightedCode = a.highlight(s.code, s.grammar, s.language)),
							a.hooks.run('before-insert', s),
							(s.element.innerHTML = s.highlightedCode),
							n && n.call(e),
							a.hooks.run('after-highlight', s),
							a.hooks.run('complete', s);
				},
				highlight: function (e, r, n) {
					var t = a.tokenize(e, r);
					return d.stringify(a.util.encode(t), n);
				},
				matchGrammar: function (e, r, n, t, i, l, o) {
					var s = a.Token;
					for (var c in n)
						if (n.hasOwnProperty(c) && n[c]) {
							if (c == o) return;
							var h = n[c];
							h = 'Array' === a.util.type(h) ? h : [h];
							for (var S = 0; S < h.length; ++S) {
								var g = h[S],
									N = g.inside,
									O = !!g.lookbehind,
									A = !!g.greedy,
									j = 0,
									T = g.alias;
								if (A && !g.pattern.global) {
									var _ = g.pattern.toString().match(/[imuy]*$/)[0];
									g.pattern = RegExp(g.pattern.source, _ + 'g');
								}
								g = g.pattern || g;
								for (var f = t, y = i; f < r.length; y += r[f].length, ++f) {
									var w = r[f];
									if (r.length > e.length) return;
									if (!(w instanceof s)) {
										g.lastIndex = 0;
										var P = 1;
										if (!(u = g.exec(w)) && A && f != r.length - 1) {
											if (((g.lastIndex = y), !(u = g.exec(e)))) break;
											for (
												var F = u.index + (O ? u[1].length : 0),
													C = u.index + u[0].length,
													b = f,
													x = y,
													z = r.length;
												b < z && (x < C || (!r[b].type && !r[b - 1].greedy));
												++b
											)
												F >= (x += r[b].length) && (++f, (y = x));
											if (r[f] instanceof s || r[b - 1].greedy) continue;
											(P = b - f), (w = e.slice(y, x)), (u.index -= y);
										}
										if (!u) {
											if (l) break;
											continue;
										}
										O && (j = u[1].length),
											(C = (F = u.index + j) + (u = u[0].slice(j)).length);
										var u,
											E = w.slice(0, F),
											$ = w.slice(C),
											k = [f, P];
										E && (++f, (y += E.length), k.push(E));
										var M = new s(c, N ? a.tokenize(u, N) : u, T, u, A);
										if (
											(k.push(M),
											$ && k.push($),
											Array.prototype.splice.apply(r, k),
											1 != P && a.matchGrammar(e, r, n, f, y, !0, c),
											l)
										)
											break;
									}
								}
							}
						}
				},
				tokenize: function (e, r, n) {
					var t = [e],
						i = r.rest;
					if (i) {
						for (var l in i) r[l] = i[l];
						delete r.rest;
					}
					return a.matchGrammar(e, t, r, 0, 0, !1), t;
				},
				hooks: {
					all: {},
					add: function (e, r) {
						var n = a.hooks.all;
						(n[e] = n[e] || []), n[e].push(r);
					},
					run: function (e, r) {
						var n = a.hooks.all[e];
						if (n && n.length) for (var i, t = 0; (i = n[t++]); ) i(r);
					},
				},
			}),
			d = (a.Token = function (e, r, n, t, i) {
				(this.type = e),
					(this.content = r),
					(this.alias = n),
					(this.length = 0 | (t || '').length),
					(this.greedy = !!i);
			});
		if (
			((d.stringify = function (e, r, n) {
				if ('string' == typeof e) return e;
				if ('Array' === a.util.type(e))
					return e
						.map(function (o) {
							return d.stringify(o, r, e);
						})
						.join('');
				var t = {
					type: e.type,
					content: d.stringify(e.content, r, n),
					tag: 'span',
					classes: ['token', e.type],
					attributes: {},
					language: r,
					parent: n,
				};
				if (e.alias) {
					var i = 'Array' === a.util.type(e.alias) ? e.alias : [e.alias];
					Array.prototype.push.apply(t.classes, i);
				}
				a.hooks.run('wrap', t);
				var l = Object.keys(t.attributes)
					.map(function (o) {
						return (
							o + '="' + (t.attributes[o] || '').replace(/"/g, '&quot;') + '"'
						);
					})
					.join(' ');
				return (
					'<' +
					t.tag +
					' class="' +
					t.classes.join(' ') +
					'"' +
					(l ? ' ' + l : '') +
					'>' +
					t.content +
					'</' +
					t.tag +
					'>'
				);
			}),
			!_self.document)
		)
			return (
				_self.addEventListener &&
					(a.disableWorkerMessageHandler ||
						_self.addEventListener(
							'message',
							function (e) {
								var r = JSON.parse(e.data),
									n = r.language,
									i = r.immediateClose;
								_self.postMessage(a.highlight(r.code, a.languages[n], n)),
									i && _self.close();
							},
							!1,
						)),
				_self.Prism
			);
		var m =
			document.currentScript ||
			[].slice.call(document.getElementsByTagName('script')).pop();
		return (
			m &&
				((a.filename = m.src),
				!a.manual &&
					!m.hasAttribute('data-manual') &&
					('loading' !== document.readyState
						? window.requestAnimationFrame
							? window.requestAnimationFrame(a.highlightAll)
							: window.setTimeout(a.highlightAll, 16)
						: document.addEventListener('DOMContentLoaded', a.highlightAll))),
			_self.Prism
		);
	})();
'undefined' != typeof module && module.exports && (module.exports = Prism),
	'undefined' != typeof global && (global.Prism = Prism),
	(Prism.languages.markup = {
		comment: /<!--[\s\S]*?-->/,
		prolog: /<\?[\s\S]+?\?>/,
		doctype: /<!DOCTYPE[\s\S]+?>/i,
		cdata: /<!\[CDATA\[[\s\S]*?]]>/i,
		tag: {
			pattern:
				/<\/?(?!\d)[^\s>\/=$<]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/i,
			inside: {
				tag: {
					pattern: /^<\/?[^\s>\/]+/i,
					inside: { punctuation: /^<\/?/, namespace: /^[^\s>\/:]+:/ },
				},
				'attr-value': {
					pattern: /=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+)/i,
					inside: {
						punctuation: [/^=/, { pattern: /(^|[^\\])["']/, lookbehind: !0 }],
					},
				},
				punctuation: /\/?>/,
				'attr-name': {
					pattern: /[^\s>\/]+/,
					inside: { namespace: /^[^\s>\/:]+:/ },
				},
			},
		},
		entity: /&#?[\da-z]{1,8};/i,
	}),
	(Prism.languages.markup.tag.inside['attr-value'].inside.entity =
		Prism.languages.markup.entity),
	Prism.hooks.add('wrap', function (p) {
		'entity' === p.type &&
			(p.attributes.title = p.content.replace(/&amp;/, '&'));
	}),
	(Prism.languages.xml = Prism.languages.markup),
	(Prism.languages.html = Prism.languages.markup),
	(Prism.languages.mathml = Prism.languages.markup),
	(Prism.languages.svg = Prism.languages.markup),
	(Prism.languages.css = {
		comment: /\/\*[\s\S]*?\*\//,
		atrule: {
			pattern: /@[\w-]+?.*?(?:;|(?=\s*\{))/i,
			inside: { rule: /@[\w-]+/ },
		},
		url: /url\((?:(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
		selector: /[^{}\s][^{};]*?(?=\s*\{)/,
		string: {
			pattern: /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
			greedy: !0,
		},
		property: /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
		important: /\B!important\b/i,
		function: /[-a-z0-9]+(?=\()/i,
		punctuation: /[(){};:]/,
	}),
	(Prism.languages.css.atrule.inside.rest = Prism.util.clone(
		Prism.languages.css,
	)),
	Prism.languages.markup &&
		(Prism.languages.insertBefore('markup', 'tag', {
			style: {
				pattern: /(<style[\s\S]*?>)[\s\S]*?(?=<\/style>)/i,
				lookbehind: !0,
				inside: Prism.languages.css,
				alias: 'language-css',
				greedy: !0,
			},
		}),
		Prism.languages.insertBefore(
			'inside',
			'attr-value',
			{
				'style-attr': {
					pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
					inside: {
						'attr-name': {
							pattern: /^\s*style/i,
							inside: Prism.languages.markup.tag.inside,
						},
						punctuation: /^\s*=\s*['"]|['"]\s*$/,
						'attr-value': { pattern: /.+/i, inside: Prism.languages.css },
					},
					alias: 'language-css',
				},
			},
			Prism.languages.markup.tag,
		)),
	(Prism.languages.clike = {
		comment: [
			{ pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/, lookbehind: !0 },
			{ pattern: /(^|[^\\:])\/\/.*/, lookbehind: !0 },
		],
		string: {
			pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
			greedy: !0,
		},
		'class-name': {
			pattern:
				/((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i,
			lookbehind: !0,
			inside: { punctuation: /[.\\]/ },
		},
		keyword:
			/\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
		boolean: /\b(?:true|false)\b/,
		function: /[a-z0-9_]+(?=\()/i,
		number: /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,
		operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
		punctuation: /[{}[\];(),.:]/,
	}),
	(Prism.languages.javascript = Prism.languages.extend('clike', {
		keyword:
			/\b(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
		number:
			/\b-?(?:0[xX][\dA-Fa-f]+|0[bB][01]+|0[oO][0-7]+|\d*\.?\d+(?:[Ee][+-]?\d+)?|NaN|Infinity)\b/,
		function: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*\()/i,
		operator:
			/-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/,
	})),
	Prism.languages.insertBefore('javascript', 'keyword', {
		regex: {
			pattern:
				/(^|[^/])\/(?!\/)(\[[^\]\r\n]+]|\\.|[^/\\\[\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
			lookbehind: !0,
			greedy: !0,
		},
		'function-variable': {
			pattern:
				/[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=\s*(?:function\b|(?:\([^()]*\)|[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/i,
			alias: 'function',
		},
	}),
	Prism.languages.insertBefore('javascript', 'string', {
		'template-string': {
			pattern: /`(?:\\[\s\S]|[^\\`])*`/,
			greedy: !0,
			inside: {
				interpolation: {
					pattern: /\$\{[^}]+\}/,
					inside: {
						'interpolation-punctuation': {
							pattern: /^\$\{|\}$/,
							alias: 'punctuation',
						},
						rest: Prism.languages.javascript,
					},
				},
				string: /[\s\S]+/,
			},
		},
	}),
	Prism.languages.markup &&
		Prism.languages.insertBefore('markup', 'tag', {
			script: {
				pattern: /(<script[\s\S]*?>)[\s\S]*?(?=<\/script>)/i,
				lookbehind: !0,
				inside: Prism.languages.javascript,
				alias: 'language-javascript',
				greedy: !0,
			},
		}),
	(Prism.languages.js = Prism.languages.javascript),
	'undefined' == typeof self ||
		!self.Prism ||
		!self.document ||
		!document.querySelector ||
		((self.Prism.fileHighlight = function () {
			var p = {
				js: 'javascript',
				py: 'python',
				rb: 'ruby',
				ps1: 'powershell',
				psm1: 'powershell',
				sh: 'bash',
				bat: 'batch',
				h: 'c',
				tex: 'latex',
			};
			Array.prototype.slice
				.call(document.querySelectorAll('pre[data-src]'))
				.forEach(function (v) {
					for (
						var d,
							a = v.getAttribute('data-src'),
							m = v,
							e = /\blang(?:uage)?-(?!\*)(\w+)\b/i;
						m && !e.test(m.className);

					)
						m = m.parentNode;
					if ((m && (d = (v.className.match(e) || [, ''])[1]), !d)) {
						var r = (a.match(/\.(\w+)$/) || [, ''])[1];
						d = p[r] || r;
					}
					var n = document.createElement('code');
					(n.className = 'language-' + d),
						(v.textContent = ''),
						(n.textContent = 'Loading\u2026'),
						v.appendChild(n);
					var t = new XMLHttpRequest();
					t.open('GET', a, !0),
						(t.onreadystatechange = function () {
							4 == t.readyState &&
								(t.status < 400 && t.responseText
									? ((n.textContent = t.responseText),
									  Prism.highlightElement(n))
									: (n.textContent =
											t.status >= 400
												? '\u2716 Error ' +
												  t.status +
												  ' while fetching file: ' +
												  t.statusText
												: '\u2716 Error: File does not exist or is empty'));
						}),
						t.send(null);
				});
		}),
		document.addEventListener('DOMContentLoaded', self.Prism.fileHighlight)),
	(Prism.languages.typescript = Prism.languages.extend('javascript', {
		keyword:
			/\b(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield|false|true|module|declare|constructor|string|Function|any|number|boolean|Array|symbol|namespace|abstract|require|type)\b/,
	})),
	(Prism.languages.ts = Prism.languages.typescript);
