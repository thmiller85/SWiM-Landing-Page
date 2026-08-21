"""Check connector SVGs for the failure modes that render as something
plausible rather than as an error."""
import re, os, sys

D = 'client/src/assets/connectors'
problems = []
for f in sorted(os.listdir(D)):
    if not f.endswith('.svg'): continue
    s = open(os.path.join(D, f), encoding='utf-8', errors='replace').read()
    tag_m = re.search(r'<svg\b[^>]*>', s)
    tag = tag_m.group(0) if tag_m else ''
    issues, W, H, ar = [], 0.0, 0.0, 0.0

    if re.search(r'<image\b|xlink:href', s):
        issues.append('placed raster')
    if not re.search(r'\bwidth\s*=\s*"[\d.]+(?:px)?"', tag):
        issues.append('no intrinsic size (or unparsable units)')

    vb = re.search(r'viewBox="([\d.\-\s]+)"', tag)
    if vb:
        _, _, W, H = [float(x) for x in vb.group(1).split()]
        ar = W / H if H else 0
        if re.search(r'd="M0,0\s*[hH]\s*%g' % W, s):
            issues.append('full-canvas background path')
        for m in re.finditer(r'<rect\b[^>]*>', s):
            r = m.group(0)
            w = re.search(r'width="([\d.]+)"', r); h = re.search(r'height="([\d.]+)"', r)
            if w and h and float(w.group(1)) >= W*0.98 and float(h.group(1)) >= H*0.98:
                issues.append('full-canvas background rect')
    else:
        issues.append('no viewBox')

    print(f'  {f:<18} {W:>6.0f}x{H:<5.0f} {ar:>5.2f}:1  {"OK" if not issues else "; ".join(sorted(set(issues)))}')
    if issues: problems.append(f)

print()
print('needs attention:', ', '.join(problems) if problems else 'none')
