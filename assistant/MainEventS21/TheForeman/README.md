# The Foreman - File Organizer

A simple Python-based utility to reorganize files and folders by their extensions.

## How to use

1. Place `foreman_organizer.py` in the directory you want to organize, or pass the path as an argument.
2. Run in Dry Run mode (default):
   ```bash
   python foreman_organizer.py
   ```
3. Run in Execution mode (to actually move files):
   ```bash
   python foreman_organizer.py --run
   ```

## Categories

- **Images**: .jpg, .jpeg, .png, .gif, .bmp, .webp, .tiff
- **Videos**: .mp4, .mkv, .mov, .avi, .wmv, .flv
- **Audio**: .mp3, .wav, .flac, .m4a, .aac, .ogg
- **Documents**: .pdf, .docx, .doc, .txt, .xlsx, .xls, .pptx, .ppt, .csv, .md
- **Archives**: .zip, .tar, .gz, .rar, .7z
- **Scripts**: .py, .sh, .js, .html, .css
- **Others**: Any other extensions
