from PIL import Image
import numpy as np

def remove_background(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    
    # Convert to numpy array
    data = np.array(img)
    
    # Get the background color from the top-left pixel
    bg_color = data[0, 0, :3]
    
    # Calculate distance of each pixel from the background color
    # We use a threshold to determine if it's background
    threshold = 50
    
    diff = np.abs(data[:, :, :3].astype(int) - bg_color.astype(int))
    dist = np.sum(diff, axis=2)
    
    # Create an alpha mask
    mask = dist > threshold
    
    # Apply mask
    data[:, :, 3] = mask * 255
    
    # Save as PNG
    out_img = Image.fromarray(data)
    out_img.save(output_path, "PNG")
    print(f"Saved {output_path}")

remove_background('static/img/frames/frame_001.jpg', 'static/img/frames/frame_001_transparent.png')
remove_background('static/img/frames/frame_002.jpg', 'static/img/frames/frame_002_transparent.png')
