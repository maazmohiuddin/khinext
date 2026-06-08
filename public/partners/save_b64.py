#!/usr/bin/env python3
import sys
import base64

# Usage: python3 save_b64.py <output_file> <base64_string>
output_file = sys.argv[1]
b64_data = sys.argv[2]

# Strip data URL prefix if present
if ',' in b64_data:
    b64_data = b64_data.split(',', 1)[1]

b64_data = b64_data.strip()
img_bytes = base64.b64decode(b64_data)

with open(output_file, 'wb') as f:
    f.write(img_bytes)

print(f"Saved {len(img_bytes)} bytes to {output_file}")
