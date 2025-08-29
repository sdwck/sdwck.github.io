import os
from PIL import Image

EXTENSIONS = ('.png', '.jpg', '.jpeg', '.webp')
INPUT_DIR = '.'
OUTPUT_DIR = 'output'
TARGET_SIZE = 512

os.makedirs(OUTPUT_DIR, exist_ok=True)

images = [f for f in os.listdir(INPUT_DIR)
          if f.lower().endswith(EXTENSIONS) and os.path.isfile(f)]

images.sort()

for i, image_name in enumerate(images, start=1):
    with Image.open(image_name) as img:
        if img.mode in ("P", "RGBA"):
            img = img.convert("RGBA")
        else:
            img = img.convert("RGB")

        width, height = img.size
        if width > height:
            new_width = TARGET_SIZE
            new_height = int(height * TARGET_SIZE / width)
        else:
            new_height = TARGET_SIZE
            new_width = int(width * TARGET_SIZE / height)

        img_resized = img.resize((new_width, new_height), Image.LANCZOS)
        output_path = os.path.join(OUTPUT_DIR, f"{i}.webp")
        img_resized.save(output_path, 'WEBP', quality=95)

print(f"✅ Converted {len(images)} images to /{OUTPUT_DIR} folder.")
