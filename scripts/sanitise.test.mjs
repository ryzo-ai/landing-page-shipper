// Regression test for the mirror sanitiser: node scripts/sanitise.test.mjs
import * as cheerio from 'cheerio'
import fs from 'node:fs'
const src = fs.readFileSync(new URL("./mirror-glopros.mjs", import.meta.url), "utf8")
const fn = src.slice(src.indexOf('// --- Sanitiser'), src.indexOf('function relabel'))
const mod = new Function('cheerio', fn + '; return { sanitise };')(cheerio)
const evil = `<div id="r"><a href="java&#x09;script:alert(1)">x</a><a href=" JaVaScRiPt:alert(1)">y</a>
<svg><a xlink:href="javascript:alert(1)"><text>z</text></a><animate attributeName="href" values="javascript:alert(1)"/><set attributeName="onmouseover" to="alert(1)"/></svg>
<img src="x" onerror="alert(1)"><img src="data:image/png;base64,AAAA"><iframe srcdoc="<script>alert(1)</script>"></iframe>
<a href="data:text/html,<script>alert(1)</script>">d</a><div style="background:url(javascript:alert(1))">s</div><math><mi xlink:href="javascript:alert(1)">m</mi></math></div>`
const $ = cheerio.load(evil)
mod.sanitise($, $('#r'))
console.log($('#r').prop('outerHTML'))
const out = $('#r').prop('outerHTML')
const bad = /javascript:|\son[a-z]+=|<(script|iframe|animate|set|math)\b|data:text/i.test(out)
if (bad) { console.error('FAIL: executable content survived'); process.exit(1) }
console.log('PASS: all payloads neutralised; safe data:image kept =', /data:image\/png/.test(out))
