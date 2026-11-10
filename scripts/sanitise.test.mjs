// Regression test for the mirror sanitiser: node scripts/sanitise.test.mjs
import * as cheerio from 'cheerio'
import { sanitise, assertSafe } from './mirror/sanitise.mjs'

const evil = `<div id="r"><a href="java&#x09;script:alert(1)">x</a><a href=" JaVaScRiPt:alert(1)">y</a>
<svg><a xlink:href="javascript:alert(1)"><text>z</text></a><animate attributeName="href" values="javascript:alert(1)"/><set attributeName="onmouseover" to="alert(1)"/><use href="data:image/svg+xml,x"/></svg>
<img src="x" onerror="alert(1)"><img src="data:image/png;base64,AAAA"><iframe srcdoc="<script>alert(1)</script>"></iframe>
<noscript><img src=x onerror=alert(1)></noscript><form action="https://evil"><input name="q"></form>
<a href="data:text/html,<script>alert(1)</script>">d</a><div style="background:url(javascript:alert(1))">s</div><math><mi xlink:href="javascript:alert(1)">m</mi></math>
<a href="tel:0207230731" data-bp-cta="x">ok</a></div>`
const $ = cheerio.load(evil)
sanitise($, $('#r'))
const out = $('#r').prop('outerHTML')
console.log(out)
const bad = /javascript:|\son[a-z]+=|<(script|iframe|animate|set|math|form|input|noscript|use)\b|data:text/i.test(out)
if (bad) { console.error('FAIL: executable content survived'); process.exit(1) }
if (!/href="tel:0207230731"/.test(out) || !/data-bp-cta="x"/.test(out)) { console.error('FAIL: safe link or data attribute was removed'); process.exit(1) }
let threw = false
try { assertSafe('<p onclick="x()">') } catch { threw = true }
if (!threw) { console.error('FAIL: assertSafe accepted an inline handler'); process.exit(1) }
console.log('PASS: all payloads neutralised; safe data:image kept =', /data:image\/png/.test(out))
